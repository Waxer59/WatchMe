package router

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/swagger"
	"github.com/waxer59/watchMe/internal/auth/auth_controller"
	"github.com/waxer59/watchMe/internal/streams/streams_controller"
	"github.com/waxer59/watchMe/internal/users/users_controller"
)

func New(app *fiber.App) {
	app.Get("/swagger/*", swagger.HandlerDefault)
	api := app.Group("api", logger.New())

	users_controller.New(api)
	auth_controller.New(api)
	streams_controller.New(api)
}
