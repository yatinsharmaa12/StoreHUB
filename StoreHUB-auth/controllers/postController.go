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




