package config

import (
	"context"
	"github.com/go-redis/redis/v8"
	"log"
)

var (
	Ctx = context.Background()
	RDB *redis.Client
)

func InitRedis() {
	RDB = redis.NewClient(&redis.Options{
		Addr: "localhost:6379", 
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
