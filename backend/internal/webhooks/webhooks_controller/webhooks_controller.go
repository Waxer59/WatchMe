package webhooks_controller

import (
	"github.com/gofiber/fiber/v2"
	"github.com/waxer59/watchMe/internal/webhooks/mux/mux_controller"
)

func New(router fiber.Router) {
	webhooks := router.Group("/webhooks")

	mux_controller.New(webhooks)
}
