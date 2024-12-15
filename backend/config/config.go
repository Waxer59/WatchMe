package config

import (
	"github.com/gofiber/fiber/v2/middleware/session"
	"log"
	"os"

	"github.com/joho/godotenv"
)

var FiberSession = session.New(session.Config{
	CookieHTTPOnly: true,
	CookieSecure:   true,
	KeyLookup:      "cookie:watchMe_session_id",
})

func GetEnv(key string) string {
	err := godotenv.Load()

	if err != nil {
		log.Fatal("Error loading .env file")
	}

	return os.Getenv(key)
}
