package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
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
		AllowOrigins:     []string{"http://localhost:5173"},                             // Allow frontend domain
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},                      // Allowed methods
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"}, // Allowed headers
		AllowCredentials: true,                                                          // Allow cookies and authorization headers
	}))

	// Authentication routes
	r.POST("/signup", controllers.Signup)                             // User signup
	r.POST("/login", controllers.Login)                               // User login
	r.GET("/validate", middlewares.RequireAuth, controllers.Validate) // Validate user token

	// User routes
	r.GET("/users", middlewares.RequireAuth, controllers.GetAllUsers)               // Fetch all users
	r.GET("/users/:email", middlewares.RequireAuth, controllers.GetUserByEmail)     // Fetch specific user by email
	r.POST("/users/:email/photo", middlewares.RequireAuth, controllers.UploadPhoto) // Upload profile photo
	r.DELETE("/users/:email", middlewares.RequireAuth, controllers.DeleteUser)      // Delete user

	// Post routes
	r.POST("/posts", middlewares.RequireAuth, controllers.CreatePost)     // Create a post

	// Comment routes
	r.POST("/comments", middlewares.RequireAuth, controllers.CreateComment)        // Add a comment to a post
	r.GET("/posts/:id/comments", middlewares.RequireAuth, controllers.GetComments) // Get all comments for a post
	r.DELETE("/comments/:id", middlewares.RequireAuth, controllers.DeleteComment)  // Delete a comment

	// Like routes
	r.POST("/likes", middlewares.RequireAuth, controllers.CreateLike)        // Add a like to a post
	r.GET("/posts/:id/likes", middlewares.RequireAuth, controllers.GetLikes) // Get all likes for a post
	r.DELETE("/likes/:id", middlewares.RequireAuth, controllers.DeleteLike)  // Remove a like
	r.Run(":3000")                                                           // Add the port explicitly (e.g., :3000)
}
