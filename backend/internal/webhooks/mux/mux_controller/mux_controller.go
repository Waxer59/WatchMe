package mux_controller

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/waxer59/watchMe/internal/webhooks/mux/mux_models"
	"github.com/waxer59/watchMe/internal/webhooks/mux/mux_service"
)

func New(router fiber.Router) {
	mux := router.Group("/mux")

	mux.Post("/", muxWebhook)
}

func muxWebhook(c *fiber.Ctx) error {
	var webhook mux_models.MuxWebhook

	err := c.BodyParser(&webhook)

	if err != nil {
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	switch webhook.Type {
	case "video.live_stream.connected":
		err = mux_service.HandleStreamConnected(webhook.Data.StreamKey)
	case "video.live_stream.disconnected":
		err = mux_service.HandleStreamDisconnected(webhook.Data.StreamKey)
	}

	if err != nil {
		fmt.Println(err.Error())
	}

	return nil
}
