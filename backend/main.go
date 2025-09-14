package main

import (
	"fmt"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/encryptcookie"
	"github.com/gofiber/fiber/v2/middleware/helmet"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/joho/godotenv"
	"github.com/waxer59/watchMe/database"
	"github.com/waxer59/watchMe/router"

	_ "github.com/waxer59/watchMe/docs"
)

// @title			WatchMe API
// @version		1.0
// @description	This is the API documentation for the WatchMe application.
// @BasePath		/api
func main() {
	isProduction := os.Getenv("ENVIRONMENT") == "PROD"

	if !isProduction {
		err := godotenv.Load()

		if err != nil {
			log.Fatal("Error loading .env file")
		}
	}

	app := fiber.New(fiber.Config{
		AppName:       "Watchme Backend",
		CaseSensitive: true,
	})

	middlewares(app)

	database.Connect()
	router.New(app)

	log.Fatal(app.Listen(fmt.Sprintf(":%s", os.Getenv("PORT"))))
}

func middlewares(app *fiber.App) {
	app.Use(cors.New(cors.Config{
		AllowOrigins:     os.Getenv("FRONTEND_URL"),
		AllowCredentials: true,
		AllowMethods:     "GET, POST, PUT, DELETE, OPTIONS",
	}))
	app.Use(logger.New())
	app.Use(helmet.New())
	app.Use(encryptcookie.New(encryptcookie.Config{
		Key: os.Getenv("COOKIE_ENCRYPTION_KEY"),
	}))
}
