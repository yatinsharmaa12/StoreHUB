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
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},                             
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE",  "OPTIONS"},                    
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"}, 
		AllowCredentials: true,                                                        
	}))

	// Authentication routes
	r.POST("/signup", controllers.Signup)                             
	r.POST("/login", controllers.Login)       

	r.GET("/validate", middlewares.RequireAuth, controllers.Validate) 

	// User routes
	r.GET("/users", middlewares.RequireAuth, controllers.GetAllUsers)              
	r.GET("/users/:email", middlewares.RequireAuth, controllers.GetUserByEmail)    
	r.POST("/users/:email/photo", middlewares.RequireAuth, controllers.UploadPhoto) 
	r.DELETE("/users/:email", middlewares.RequireAuth, controllers.DeleteUser)      
	r.GET("/users/me", middlewares.RequireAuth, controllers.GetCurrentUser)               


	// Post routes
	r.POST("/posts", middlewares.RequireAuth, controllers.CreatePost)     
	r.GET("/posts", middlewares.RequireAuth, controllers.GetAllPosts)               
	r.GET("/posts/:id", middlewares.RequireAuth, controllers.GetPostByID)           

	// Comment routes
	r.POST("/comments", middlewares.RequireAuth, controllers.CreateComment)        
	// r.GET("/posts/:id/comments", middlewares.RequireAuth, controllers.GetComments) 
	// r.DELETE("/comments/:id", middlewares.RequireAuth, controllers.DeleteComment) 

	// Like routes
	r.POST("/likes", middlewares.RequireAuth, controllers.CreateLike)       
	// r.GET("/posts/:id/likes", middlewares.RequireAuth, controllers.GetLikes) 
	// r.DELETE("/likes/:id", middlewares.RequireAuth, controllers.DeleteLike) 
	
	r.Run(":3000")                                                          
}
