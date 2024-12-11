package main

import (
	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/cors" 
	"github.com/rishyym0927/StoreHUB-auth/controllers"
	"github.com/rishyym0927/StoreHUB-auth/initializers"
	"github.com/rishyym0927/StoreHUB-auth/middlewares"
)

func init() {
	initializers.LoadEnvVariables()
	initializers.ConnectToDB()
	initializers.SyncDatabase()
}

func main() {
	r := gin.Default()

	// Enable CORS middleware with specific options
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"}, // Allow frontend domain
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"}, // Allowed methods
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"}, // Allowed headers
		AllowCredentials: true, // Allow cookies and authorization headers
	}))

	// Authentication routes
	r.POST("/signup", controllers.Signup)
	r.POST("/login", controllers.Login)
	r.GET("/validate", middlewares.RequireAuth, controllers.Validate)

	// User management routes
	r.GET("/users", middlewares.RequireAuth, controllers.GetAllUsers)               // Fetch all users
	r.GET("/users/:email", middlewares.RequireAuth, controllers.GetUserByEmail)     // Fetch specific user by email
	r.POST("/users/:email/photo", middlewares.RequireAuth, controllers.UploadPhoto) // Upload a new profile photo
	r.DELETE("/users/:email", middlewares.RequireAuth, controllers.DeleteUser)      // Delete a user

	// Start the server on port 3000
	r.Run(":3000") // Add the port explicitly (e.g., :3000)
}
