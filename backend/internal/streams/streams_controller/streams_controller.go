package streams_controller

import (
	"github.com/gofiber/fiber/v2"
	"github.com/waxer59/watchMe/internal/streams/streams_service"
	"github.com/waxer59/watchMe/internal/users/user_entities"
	"github.com/waxer59/watchMe/internal/users/users_service"
	"github.com/waxer59/watchMe/router/router_middlewares"
)

func New(router fiber.Router) {
	streams := router.Group("/streams")

	streams.Use(router_middlewares.AuthMiddleware)
	streams.Get("/generate-key", generateStreamKey)
	streams.Delete("/delete-key/:streamKeyId", deleteStreamKey)
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

	_, err = users_service.CreateStreamKey(streamKey.Data.Id, streamKey.Data.StreamKey, c.Locals("user").(*user_entities.User).ID)

	if err != nil {
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	return c.JSON(fiber.Map{
		"id":        streamKey.Data.Id,
		"streamKey": streamKey.Data.StreamKey,
	})
}

// @title			Delete Stream Key
// @description	Delete a stream key for a live stream
// @tags			Streams
// @router			/streams/delete-key/:streamKeyId [delete]
func deleteStreamKey(c *fiber.Ctx) error {
	streamKeyId := c.Params("streamKeyId")

	streamKey, err := users_service.FindStreamKeyById(streamKeyId)

	if err != nil {
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	if streamKey.UserID != c.Locals("user").(*user_entities.User).ID {
		return c.SendStatus(fiber.StatusUnauthorized)
	}

	err = streams_service.DeleteStreamKey(streamKeyId)

	if err != nil {
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	return c.SendStatus(fiber.StatusOK)
}
