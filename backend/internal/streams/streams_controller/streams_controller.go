package streams_controller

import (
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/waxer59/watchMe/internal/streams/streams_service"
	"github.com/waxer59/watchMe/internal/users/user_entities"
	"github.com/waxer59/watchMe/internal/users/users_service"
	"github.com/waxer59/watchMe/router/router_middlewares"
)

func New(router fiber.Router) {
	streams := router.Group("/streams")

	streams.Post("/generate-key", router_middlewares.AuthMiddleware, generateStreamKey)
	streams.Delete("/delete-key/:streamKeyId", router_middlewares.AuthMiddleware, deleteStreamKey)
	streams.Get("/feed", getStreamFeed)
	streams.Get("/:username", getLiveStream)
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

// @title	Delete Stream Key
// @description	Delete a stream key for a live stream
// @tags Streams
// @router /streams/delete-key/:streamKeyId [delete]
// @param	streamKeyId path string	true	"Stream key id"
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

	err = users_service.DeleteStreamKeyById(streamKeyId)

	if err != nil {
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	return c.SendStatus(fiber.StatusOK)
}

// @title			Get Stream Feed
// @description	Get the feed for the home page
// @tags			Streams
// @router			/streams/feed [get]
func getStreamFeed(c *fiber.Ctx) error {
	streamsFeed, err := streams_service.GetStreamFeed()

	if err != nil {
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	return c.JSON(streamsFeed)
}

// @title			Get Live Stream
// @description	Get the live stream for the user
// @tags			Streams
// @router			/streams/:username [get]
// @param			username	path string	true	"Username of the user"
func getLiveStream(c *fiber.Ctx) error {
	username := c.Params("username")

	stream, err := streams_service.GetLiveStreamByUsername(username)

	if err != nil {
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	if stream.UserId == uuid.Nil {
		return c.SendStatus(fiber.StatusNotFound)
	}

	return c.JSON(stream)
}
