package mux_controller

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/waxer59/watchMe/internal/webhooks/mux/mux_helper"
	"github.com/waxer59/watchMe/internal/webhooks/mux/mux_models"
	"github.com/waxer59/watchMe/internal/webhooks/mux/mux_service"
)

func New(router fiber.Router) {
	mux := router.Group("/mux")

	mux.Post("/", muxWebhook)
}

func muxWebhook(c *fiber.Ctx) error {
	// We need to send a 200 OK response inmediately to acknowledge the webhook
	c.SendStatus(fiber.StatusOK)

	var webhook mux_models.MuxWebhook

	err := c.BodyParser(&webhook)
	fmt.Println(webhook.Type)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).Send([]byte("{}"))
	}

	err = mux_helper.IsValidMuxSignature(c.Get("Mux-Signature"), c.Body())

	if err != nil {
		return c.SendStatus(fiber.StatusBadRequest)
	}

	switch webhook.Type {
	case "video.live_stream.active":
		err = mux_service.HandleStreamActive(webhook)
	case "video.live_stream.disconnected":
		err = mux_service.HandleStreamDisconnected(webhook)
	case "video.asset.live_stream_completed":
		err = mux_service.HandleAssetLiveStreamCompleted(webhook)
	}

	if err != nil {
		fmt.Println(err.Error())
	}

	return nil
}
