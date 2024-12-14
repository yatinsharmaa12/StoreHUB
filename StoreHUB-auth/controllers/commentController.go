package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/rishyym0927/StoreHUB-auth/initializers"
	"github.com/rishyym0927/StoreHUB-auth/models"
)

// CreateComment creates a new comment
func CreateComment(c *gin.Context) {
    postID := c.Param("postId")
    
    var body struct {
        Content string `json:"content" binding:"required"`
    }
    if err := c.ShouldBindJSON(&body); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    user, exists := c.Get("user")
    if !exists {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
        return
    }
    currentUser, ok := user.(*models.User)
    if !ok {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user type"})
        return
    }

    // Check if post exists
    var post models.Post
    if err := initializers.DB.First(&post, postID).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Post not found"})
        return
    }

    // Create new comment
    comment := models.Comment{
        UserID:  currentUser.ID,
        PostID:  post.ID,
        Content: body.Content,
    }

    if err := initializers.DB.Create(&comment).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{
            "error": "Failed to create comment",
            "details": err.Error(),
        })
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "message": "Comment added successfully",
        "comment": comment,
    })
}

// GetPostComments retrieves all comments for a specific post
func GetPostComments(c *gin.Context) {
    postID := c.Param("postId")

    // Validate post ID
    if postID == "" {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid post ID"})
        return
    }

    // Check if post exists first
    var post models.Post
    if err := initializers.DB.First(&post, postID).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Post not found"})
        return
    }

    // Retrieve comments with associated user information
    var comments []models.Comment
    result := initializers.DB.
        Preload("User"). // Eager load user details
        Where("post_id = ?", postID).
        Order("created_at DESC"). // Optional: sort comments by creation time
        Find(&comments)
    
    if result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{
            "error": "Failed to retrieve comments",
            "details": result.Error.Error(),
        })
        return
    }

    // Prepare response with comments and additional metadata
    response := gin.H{
        "comments": comments,
        "total_comments": len(comments),
        "post_id": postID,
    }

    // If no comments found, ensure comments is an empty array
    if len(comments) == 0 {
        response["comments"] = []models.Comment{}
    }

    c.JSON(http.StatusOK, response)
}

// Optional: GetCommentsByUser retrieves comments made by a specific user
func GetCommentsByUser(c *gin.Context) {
    userID := c.Param("userId")

    // Validate user ID
    if userID == "" {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
        return
    }

    // Check if user exists
    var user models.User
    if err := initializers.DB.First(&user, userID).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
        return
    }

    // Retrieve comments with associated post information
    var comments []models.Comment
    result := initializers.DB.
        Preload("Post"). // Eager load post details
        Where("user_id = ?", userID).
        Order("created_at DESC").
        Find(&comments)
    
    if result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{
            "error": "Failed to retrieve user comments",
            "details": result.Error.Error(),
        })
        return
    }

    // Prepare response
    response := gin.H{
        "comments": comments,
        "total_comments": len(comments),
        "user_id": userID,
    }

    // If no comments found, ensure comments is an empty array
    if len(comments) == 0 {
        response["comments"] = []models.Comment{}
    }

    c.JSON(http.StatusOK, response)
}