package controllers

import (
	"github.com/gin-gonic/gin"
	"github.com/rishyym0927/StoreHUB-auth/initializers"
	"github.com/rishyym0927/StoreHUB-auth/models"
	"net/http"
)

// GetAllUsers fetches all users
func GetAllUsers(c *gin.Context){
	var users []models.User
	if err := initializers.DB.Find(&users).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch users", "details": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"users": users})

}

// GetUserByEmail fetches a specific user by email
func GetUserByEmail(c *gin.Context) {
	email := c.Param("email")
	var user models.User
	if err := initializers.DB.First(&user, "email = ?", email).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"user": user})
}


// UploadPhoto uploads a new profile photo
func UploadPhoto(c *gin.Context) {
	email := c.Param("email")
	file, err := c.FormFile("photo")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to get photo"})
		return
	}

	var user models.User
	if err := initializers.DB.First(&user, "email = ?", email).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	filePath := "uploads/" + file.Filename
	if err := c.SaveUploadedFile(file, filePath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save photo"})
		return
	}

	user.ProfilePhoto = filePath
	if err := initializers.DB.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update profile photo", "details": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Profile photo updated successfully"})
}

// DeleteUser deletes a user by email
func DeleteUser(c *gin.Context) {
	email := c.Param("email")
	if err := initializers.DB.Delete(&models.User{}, "email = ?", email).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete user", "details": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "User deleted successfully"})
}

func GetCurrentUser(c *gin.Context) {
	// Retrieve the user from the context (set by RequireAuth middleware)
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	// Type assert the user to the User model
	authenticatedUser, ok := user.(models.User)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve user details"})
		return
	}

	// Return the user details (exclude sensitive fields like password)
	c.JSON(http.StatusOK, gin.H{
		"id":    authenticatedUser.ID,
		"email": authenticatedUser.Email,
		"username":  authenticatedUser.Username,
		// Add other non-sensitive fields if needed
	})
}