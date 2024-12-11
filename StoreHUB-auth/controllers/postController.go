package controllers

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/rishyym0927/StoreHUB-auth/initializers"
	"github.com/rishyym0927/StoreHUB-auth/models"
	"encoding/json"
)

// CreatePost creates a new post
func CreatePost(c *gin.Context) {
    var body struct {
        Title         string   `json:"title" binding:"required"`
        Description   string   `json:"description" binding:"required"`
        Images        []string `json:"images"`
        CodeSnippet   string   `json:"codeSnippet"`
        Framework     string   `json:"framework"`
        ComponentType string   `json:"componentType"`
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
    var imagesJSON []byte
    var err error
    if len(body.Images) > 0 {
        imagesJSON, err = json.Marshal(body.Images)
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process images"})
            return
        }
    }
    post := models.Post{
        UserID:        currentUser.ID,
        Title:         body.Title,
        Description:   body.Description,
        Images:        string(imagesJSON),  // Store as a JSON string
        CodeSnippet:   body.CodeSnippet,
        Framework:     body.Framework,
        ComponentType: body.ComponentType,
    }

    // Save the post to the database
    result := initializers.DB.Create(&post)
    if result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{
            "error": "Failed to create post", 
            "details": result.Error.Error(),
        })
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "message": "Post created successfully", 
        "post": post,
    })
}


func GetAllPosts(c *gin.Context) {
    var posts []models.Post
    
    // Optional query parameters for filtering
    framework := c.Query("framework")
    componentType := c.Query("componentType")

    // Base query with preloading related data
    query := initializers.DB.Preload("User").
        Preload("Likes").
        Preload("Likes.User").
        Preload("Comments").
        Preload("Comments.User")

    // Apply filters if provided
    if framework != "" {
        query = query.Where("framework = ?", framework)
    }
    if componentType != "" {
        query = query.Where("component_type = ?", componentType)
    }

    // Execute query
    result := query.Find(&posts)
    if result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{
            "error": "Failed to retrieve posts",
            "details": result.Error.Error(),
        })
        return
    }

    // Process posts to parse images and prepare response
    processedPosts := make([]gin.H, len(posts))
    for i, post := range posts {
        var images []string
        if post.Images != "" {
            json.Unmarshal([]byte(post.Images), &images)
        }

        // Process likes
        likes := make([]gin.H, len(post.Likes))
        for j, like := range post.Likes {
            likes[j] = gin.H{
                "id": like.ID,
                "user": gin.H{
                    "id":       like.User.ID,
                    "username": like.User.Username,
                },
            }
        }

        // Process comments
        comments := make([]gin.H, len(post.Comments))
        for j, comment := range post.Comments {
            comments[j] = gin.H{
                "id":      comment.ID,
                "content": comment.Content,
                "user": gin.H{
                    "id":       comment.User.ID,
                    "username": comment.User.Username,
                },
                "createdAt": comment.CreatedAt,
            }
        }

        processedPosts[i] = gin.H{
            "id":            post.ID,
            "title":         post.Title,
            "description":   post.Description,
            "images":        images,
            "codeSnippet":   post.CodeSnippet,
            "framework":     post.Framework,
            "componentType": post.ComponentType,
            "user": gin.H{
                "id":       post.User.ID,
                "username": post.User.Username,
            },
            "likes":    likes,
            "comments": comments,
            "createdAt": post.CreatedAt,
        }
    }

    c.JSON(http.StatusOK, gin.H{
        "posts": processedPosts,
        "count": len(processedPosts),
    })
}

// GetPostByID retrieves a single post by its ID with detailed information
func GetPostByID(c *gin.Context) {
    postID := c.Param("id")

    var post models.Post
    result := initializers.DB.
        Preload("User").
        Preload("Likes").
        Preload("Likes.User").
        Preload("Comments").
        Preload("Comments.User").
        First(&post, postID)

    if result.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{
            "error": "Post not found",
            "details": result.Error.Error(),
        })
        return
    }

    // Parse images
    var images []string
    if post.Images != "" {
        json.Unmarshal([]byte(post.Images), &images)
    }

    // Process likes
    likes := make([]gin.H, len(post.Likes))
    for j, like := range post.Likes {
        likes[j] = gin.H{
            "id": like.ID,
            "user": gin.H{
                "id":       like.User.ID,
                "username": like.User.Username,
            },
        }
    }

    // Process comments
    comments := make([]gin.H, len(post.Comments))
    for j, comment := range post.Comments {
        comments[j] = gin.H{
            "id":      comment.ID,
            "content": comment.Content,
            "user": gin.H{
                "id":       comment.User.ID,
                "username": comment.User.Username,
            },
            "createdAt": comment.CreatedAt,
        }
    }

    postResponse := gin.H{
        "id":            post.ID,
        "title":         post.Title,
        "description":   post.Description,
        "images":        images,
        "codeSnippet":   post.CodeSnippet,
        "framework":     post.Framework,
        "componentType": post.ComponentType,
        "user": gin.H{
            "id":       post.User.ID,
            "username": post.User.Username,
        },
        "likes":    likes,
        "comments": comments,
        "createdAt": post.CreatedAt,
    }

    c.JSON(http.StatusOK, postResponse)
}