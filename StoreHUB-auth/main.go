package main

import (
	"net/http"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/prometheus/client_golang/prometheus/promhttp"


	"github.com/rishyym0927/StoreHUB-auth/config"
	"github.com/rishyym0927/StoreHUB-auth/controllers"
	"github.com/rishyym0927/StoreHUB-auth/initializers"
	"github.com/rishyym0927/StoreHUB-auth/middlewares"
)

func init() {
	// Initialize environment variables, DB connection, etc.
	initializers.LoadEnvVariables()
	initializers.ConnectToDB()
	initializers.SyncDatabase()
	config.InitRedis()

	// Initialize Zap logger
	initializers.InitLogger()

	// Initialize Prometheus metrics
	initializers.InitPrometheus()
}

func main() {
	// Example log usage
	initializers.SugarLogger.Info("Server is starting...")

	// Gin setup
	r := gin.Default()

	// CORS middleware configuration
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		AllowCredentials: true,
	}))

	r.Use(func(c *gin.Context) {
		// Increment the request counter for the method and endpoint
		initializers.RequestCounter.WithLabelValues(c.Request.Method, c.FullPath()).Inc()
		c.Next()
	})

	// Prometheus /metrics endpoint
	r.GET("/metrics", gin.WrapH(promhttp.Handler()))

	// Example route where requestCounter is incremented
	r.GET("/", func(c *gin.Context) {
		// Increment the request counter for this route and method
		initializers.RequestCounter.WithLabelValues(c.Request.Method, "/").Inc()
		c.JSON(http.StatusOK, gin.H{
			"message": "Request allowed",
			"time":    time.Now(),
		})
	})

	// Authentication routes
	r.POST("/signup", controllers.Signup)
	r.POST("/login", controllers.Login)

	r.GET("/validate", middlewares.RequireAuth, controllers.Validate)

	// User routes
	r.GET("/users", middlewares.RequireAuth, controllers.GetAllUsers)
	r.GET("/users/email/:email", middlewares.RequireAuth, controllers.GetUserByEmail)
	r.GET("/users/username/:username", middlewares.RequireAuth, controllers.GetUserByUsername)
	r.POST("/users/:email/photo", middlewares.RequireAuth, controllers.UploadPhoto)
	r.DELETE("/users/:email", middlewares.RequireAuth, controllers.DeleteUser)
	r.GET("/users/me", middlewares.RequireAuth, controllers.GetCurrentUser)

	// Post routes
	r.POST("/posts", middlewares.RequireAuth, controllers.CreatePost)
	r.GET("/posts", middlewares.RequireAuth, controllers.GetAllPosts)
	r.GET("/posts/:id", middlewares.RequireAuth, controllers.GetPostByID)

	// Comment routes
	r.POST("/comments/:postId", middlewares.RequireAuth, controllers.CreateComment)
	r.GET("/comments/:postId", middlewares.RequireAuth, controllers.GetPostComments)



	// Like routes
	r.POST("/likes", middlewares.RequireAuth, controllers.CreateLike)


	// Sandbox routes
	r.POST("/sandbox", middlewares.RequireAuth, controllers.CreateSandbox)
	r.GET("/sandbox", middlewares.RequireAuth, controllers.GetAllSandboxes)
	r.GET("/sandbox/:id", middlewares.RequireAuth, controllers.GetSandboxByID)

	// Run the server
	initializers.SugarLogger.Info("Server running on port 3000")
	r.Run(":3000")
}
