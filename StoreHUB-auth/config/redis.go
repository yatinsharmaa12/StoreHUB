package config

import (
	"context"
	"github.com/go-redis/redis/v8"
	"log"
	"os"
)

var (
	Ctx = context.Background()
	RDB *redis.Client
)

func InitRedis() {

	redisHost := os.Getenv("REDIS_HOST")
    redisPort := os.Getenv("REDIS_PORT")
    if redisHost == "" {
        redisHost = "localhost"
    }
    if redisPort == "" {
        redisPort = "6379"
    }

	RDB = redis.NewClient(&redis.Options{
		Addr: redisHost + ":" + redisPort, 
		Password: "",
		DB: 0,
	})


	ping, err := RDB.Ping(Ctx).Result()
	if err != nil {
		log.Fatalf("Failed to connect to Redis: %v", err)
	}

	log.Println("Connected to Redis")
	log.Println(ping)
}
