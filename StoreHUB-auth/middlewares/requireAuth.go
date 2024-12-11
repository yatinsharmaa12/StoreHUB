package middlewares

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/rishyym0927/StoreHUB-auth/initializers"
	"github.com/rishyym0927/StoreHUB-auth/models"
)

// RequireAuth middleware to check if the request has a valid JWT
func RequireAuth(c *gin.Context) {
	// Retrieve the token from the "Authorization" cookie
	tokenString, err := c.Cookie("Authorization")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized, no token found"})
		c.Abort()
		return
	}

	// Parse and validate the JWT token
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// Validate the token signing method
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		// Return the JWT secret for verification
		return []byte(os.Getenv("JWTSECRET")), nil
	})

	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token", "details": err.Error()})
		c.Abort()
		return
	}

	// Ensure the claims are valid and the token is not expired
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		// Check for expiration
		if time.Now().Unix() > int64(claims["exp"].(float64)) {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Token has expired"})
			c.Abort()
			return
		}

		// Retrieve the user from the database using the 'sub' claim (user ID)
		var user models.User
		if err := initializers.DB.First(&user, claims["sub"]).Error; err != nil || user.ID == 0 {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
			c.Abort()
			return
		}

		// Set the user in the context for further use
		c.Set("user", user)
		c.Next()

		// Optionally, log the claims for debugging purposes (remove in production)
		fmt.Println("User ID:", claims["sub"], "Token Expiry:", claims["exp"])
	} else {
		// If the token's claims are not valid
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
		c.Abort()
	}
}
