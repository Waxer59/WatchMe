package streams_controller

import (
	"github.com/gofiber/fiber/v2"
	"github.com/waxer59/watchMe/internal/streams/streams_service"
	"github.com/waxer59/watchMe/router/router_middlewares"
)

func New(router fiber.Router) {
	streams := router.Group("/streams")

	streams.Use(router_middlewares.AuthMiddleware)
	streams.Get("/generate-key", generateStreamKey)
}

// @title			Generate Stream Key
// @description	Generate a stream key for a live stream
// @tags			Streams
// @router			/streams/generate-key [get]
func generateStreamKey(c *fiber.Ctx) error {
	channelId := c.Params("channelId")

	streamKey, err := streams_service.GenerateStreamKey(channelId)

	if err != nil {
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	return c.JSON(fiber.Map{
		"streamKey": streamKey,
	})
}
