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