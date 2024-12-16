package router

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/swagger"
	"github.com/waxer59/watchMe/internal/auth/auth_controller"
)

func New(app *fiber.App) {
	app.Get("/swagger/*", swagger.HandlerDefault)
	api := app.Group("api", logger.New())

	auth_controller.New(api)
}
