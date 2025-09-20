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
	var webhook mux_models.MuxWebhook

	err := c.BodyParser(&webhook)
	fmt.Println(webhook.Type)

	if err != nil {
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	go func(w mux_models.MuxWebhook, b []byte, muxSignature string) {
		err = mux_helper.IsValidMuxSignature(muxSignature, b)

		if err != nil {
			return
		}

		switch w.Type {
		case "video.live_stream.active":
			err = mux_service.HandleStreamActive(w)
		case "video.live_stream.disconnected":
			err = mux_service.HandleStreamDisconnected(w)
		case "video.asset.live_stream_completed":
			err = mux_service.HandleAssetLiveStreamCompleted(w)
		}

		if err != nil {
			fmt.Println(err.Error())
		}
	}(webhook, c.Body(), c.Get("Mux-Signature"))

	return c.SendStatus(fiber.StatusOK)
}
