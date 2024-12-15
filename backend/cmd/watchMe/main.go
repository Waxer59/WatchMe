package main

import (
	"fmt"
	"github.com/gofiber/contrib/swagger"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/encryptcookie"
	"github.com/gofiber/fiber/v2/middleware/helmet"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/waxer59/watchMe/config"
	"github.com/waxer59/watchMe/database"
	"github.com/waxer59/watchMe/router"
	"log"
)

func main() {
	app := fiber.New(fiber.Config{
		AppName:       "Watchme Backend",
		CaseSensitive: true,
	})

	middlewares(app)

	database.Connect()
	router.New(app)

	log.Fatal(app.Listen(fmt.Sprintf(":%s", config.GetEnv("PORT"))))
}

func middlewares(app *fiber.App) {
	app.Use(cors.New())
	app.Use(logger.New())
	app.Use(helmet.New())
	app.Use(encryptcookie.New(encryptcookie.Config{
		Key: config.GetEnv("COOKIE_ENCRYPTION_KEY"),
	}))
	app.Use(swagger.New())
}
