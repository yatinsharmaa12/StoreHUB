package controllers

import (
	"log"
	"net/http"
	"strconv"
	"sync"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/rishyym0927/StoreHUB-auth/initializers"
	"github.com/rishyym0927/StoreHUB-auth/models"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

type Server struct {
	mu       sync.Mutex
	channels map[string][]*websocket.Conn
}

// NewServer initializes a new WebSocket server instance.
func NewServer() *Server {
	return &Server{
		channels: make(map[string][]*websocket.Conn),
	}
}

// HandleWebSocket manages WebSocket connections for a specific channel.
func (s *Server) HandleWebSocket(c *gin.Context) {
    channel := c.Query("channel")
    userID := c.Query("user_id")
    
    // Provide more detailed logging and error handling
    log.Printf("Received connection request - Channel: %s, UserID: %s", channel, userID)
    
    // Handle empty or invalid user ID
    if channel == "" {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Channel is required"})
        return
    }
    
    // Default to 0 if user ID is empty or invalid
    var userIDInt int
    if userID == "" || userID == "undefined" {
        log.Printf("No user ID provided, defaulting to 0")
        userIDInt = 0
    } else {
        var err error
        userIDInt, err = strconv.Atoi(userID)
        if err != nil {
            log.Printf("Invalid user_id: %s, error: %v. Defaulting to 0", userID, err)
            userIDInt = 0
        }
    }

    // Upgrade the connection to WebSocket
    conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
    if err != nil {
        log.Printf("WebSocket upgrade failed for channel %s: %v", channel, err)
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upgrade WebSocket"})
        return
    }

    // Log the connection
    log.Printf("User %d connected to channel: %s", userIDInt, channel)

    // Ensure connection cleanup on disconnect
    defer func() {
        conn.Close()
        s.removeConnection(channel, conn)
        log.Printf("User %d disconnected from channel %s", userIDInt, channel)
    }()

    // Add the connection to the channel
    s.mu.Lock()
    s.channels[channel] = append(s.channels[channel], conn)
    s.mu.Unlock()

    // Listen for incoming messages
    for {
        var msg map[string]string
        if err := conn.ReadJSON(&msg); err != nil {
            log.Printf("Error reading message from user %d in channel %s: %v", userIDInt, channel, err)
            break
        }

        content := msg["content"]
        chat := models.Chat{
            UserID:  uint(userIDInt),
            Channel: channel,
            Content: content,
        }

        // Save the chat message to the database
        if err := initializers.DB.Create(&chat).Error; err != nil {
            log.Printf("Failed to save chat for user %d in channel %s: %v", userIDInt, channel, err)
        }

        // Broadcast the message to the channel
        s.broadcastMessage(channel, msg)
    }
}

// broadcastMessage sends a message to all active connections in a channel.
func (s *Server) broadcastMessage(channel string, msg map[string]string) {
	s.mu.Lock()
	defer s.mu.Unlock()

	conns := s.channels[channel]
	for _, conn := range conns {
		if err := conn.WriteJSON(msg); err != nil {
			log.Printf("Broadcast error in channel %s: %v", channel, err)
		}
	}
}

// removeConnection removes a WebSocket connection from the channel.
func (s *Server) removeConnection(channel string, conn *websocket.Conn) {
	s.mu.Lock()
	defer s.mu.Unlock()

	var updatedConns []*websocket.Conn
	for _, existingConn := range s.channels[channel] {
		if existingConn != conn {
			updatedConns = append(updatedConns, existingConn)
		}
	}
	s.channels[channel] = updatedConns
}
