package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/rishyym0927/StoreHUB-auth/controllers"
)

func WebSocketRoutes(router *gin.Engine) {
	
	server := controllers.NewServer()

	router.GET("/ws", server.HandleWebSocket)
}
