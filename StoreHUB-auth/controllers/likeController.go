package controllers

import (
    "github.com/gin-gonic/gin"
    "github.com/rishyym0927/StoreHUB-auth/initializers"
    "github.com/rishyym0927/StoreHUB-auth/models"
	"net/http"
)


func CreateLike(c *gin.Context) {
	var body struct {
		PostID uint `json:"post_id" binding:"required"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input parameters", "details": err.Error()})
		return
	}

	user, _ := c.Get("user")
	userID := user.(models.User).ID

	like := models.Like{
		PostID: body.PostID,
		UserID: userID,
	}

	if err := initializers.DB.Create(&like).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add like", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Like added successfully"})
}

func GetLikes(c *gin.Context) {
	postID := c.Param("id")

	var likes []models.Like
	if err := initializers.DB.Where("post_id = ?", postID).Find(&likes).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch likes", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"likes": likes})
}

func DeleteLike(c *gin.Context) {
	likeID := c.Param("id")

	if err := initializers.DB.Delete(&models.Like{}, "id = ?", likeID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete like", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Like deleted successfully"})
}