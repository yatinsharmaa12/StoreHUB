package controllers

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/rishyym0927/StoreHUB-auth/initializers"
	"github.com/rishyym0927/StoreHUB-auth/models"
)

func CreateSanbox(c *gin.Context) {
	var body struct {
		Title       string `json:"title" binding:"required"`
		Description string `json:"description" binding:"required"`
		Elink       string `json:"elink" binding:"required"`
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

	sandbox := models.Sandbox{
		UserID:      currentUser.ID,
		Title:       body.Title,
		Description: body.Description,
		Elink:       body.Elink,
	}

	result := initializers.DB.Create(&sandbox)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": sandbox})
	fmt.Printf("New sandbox created: %+v\n", sandbox)

}

func GetAllSandboxes(c *gin.Context) {
	var sandboxes []models.Sandbox

	// Fetch all sandboxes from the database
	result := initializers.DB.Find(&sandboxes)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	// Return the sandboxes in the response
	c.JSON(http.StatusOK, gin.H{"data": sandboxes})
}
