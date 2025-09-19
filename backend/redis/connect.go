package redis

import (
	"fmt"
	"os"

	"github.com/redis/go-redis/v9"
)

var RedisClient *redis.Client

func Connect() {
	RedisClient = redis.NewClient(&redis.Options{
		Username: os.Getenv("REDIS_USERNAME"),
		Addr:     fmt.Sprintf("%s:%s", os.Getenv("REDIS_HOST"), os.Getenv("REDIS_PORT")),
		Password: os.Getenv("REDIS_PASSWORD"),
		DB:       0,
	})
	fmt.Println("Connected to Redis")
}
