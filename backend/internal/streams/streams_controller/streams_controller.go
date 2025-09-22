package streams_controller

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/waxer59/watchMe/internal/streams/streams_entities"
	"github.com/waxer59/watchMe/internal/streams/streams_service"
	"github.com/waxer59/watchMe/internal/users/user_entities"
	"github.com/waxer59/watchMe/internal/users/users_service"
	"github.com/waxer59/watchMe/internal/viewers/viewers_service"
	"github.com/waxer59/watchMe/router/router_middlewares"
)

func New(router fiber.Router) {
	streams := router.Group("/streams")

	streams.Post("/generate-key", router_middlewares.AuthMiddleware, generateStreamKey)
	streams.Delete("/delete-key/:streamKeyId", router_middlewares.AuthMiddleware, deleteStreamKey)
	streams.Get("/feed", getStreamFeed)
	streams.Get("/:username", getLiveStream)
	streams.Patch("/edit-stream/:playbackId", router_middlewares.AuthMiddleware, editStream)
	streams.Delete("/delete-stream/:playbackId", router_middlewares.AuthMiddleware, deleteStream)
	streams.Get("/categories/viewers", getStreamCategoriesViewers)
}

// @title			Generate Stream Key
// @description	Generate a stream key for a live stream
// @tags			Streams
// @router			/streams/generate-key [get]
func generateStreamKey(c *fiber.Ctx) error {
	channelId := c.Params("channelId")

	streamKey, err := streams_service.GenerateStreamKey(channelId)

	if err != nil {
		fmt.Println(err.Error())
		return c.Status(fiber.StatusInternalServerError).Send([]byte("{}"))
	}

	_, err = users_service.CreateStreamKey(streamKey.Data.Id, streamKey.Data.StreamKey, c.Locals("user").(*user_entities.User).ID)

	if err != nil {
		fmt.Println(err.Error())
		return c.Status(fiber.StatusInternalServerError).Send([]byte("{}"))
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
		return c.Status(fiber.StatusInternalServerError).Send([]byte("{}"))
	}

	if streamKey.UserID != c.Locals("user").(*user_entities.User).ID {
		return c.Status(fiber.StatusUnauthorized).Send([]byte("{}"))
	}

	err = streams_service.DeleteStreamKey(streamKeyId)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).Send([]byte("{}"))
	}

	err = users_service.DeleteStreamKeyById(streamKeyId)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).Send([]byte("{}"))
	}

	return c.Status(fiber.StatusOK).Send([]byte("{}"))
}

// @title			Get Stream Feed
// @description	Get the feed for the home page
// @tags			Streams
// @router			/streams/feed [get]
func getStreamFeed(c *fiber.Ctx) error {
	category := c.Query("category")

	streamsFeed, err := streams_service.GetStreamFeed(&category)

	if err != nil {
		fmt.Println(err.Error())
		return c.Status(fiber.StatusInternalServerError).Send([]byte("{}"))
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

	if stream == nil {
		return c.Status(fiber.StatusNotFound).Send([]byte("{}"))
	}

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).Send([]byte("{}"))
	}

	if stream.UserId == uuid.Nil {
		return c.Status(fiber.StatusNotFound).Send([]byte("{}"))
	}

	return c.JSON(stream)
}

type EditStream struct {
	Title    string `json:"title"`
	Category string `json:"category"`
}

// @title			Edit Stream
// @description	Edit the title of a live stream
// @tags			Streams
// @router			/streams/edit-stream/:playbackId [patch]
// @param			playbackId	path string	true	"Playback ID of the stream"
func editStream(c *fiber.Ctx) error {
	playbackId := c.Params("playbackId")

	var streamData EditStream

	err := c.BodyParser(&streamData)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).Send([]byte("{}"))
	}

	stream, err := streams_service.GetStreamByPlaybackId(playbackId)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).Send([]byte("{}"))
	}

	if stream.UserId == uuid.Nil {
		return c.Status(fiber.StatusNotFound).Send([]byte("{}"))
	}

	if stream.UserId != c.Locals("user").(*user_entities.User).ID {
		return c.Status(fiber.StatusUnauthorized).Send([]byte("{}"))
	}

	err = streams_service.EditStreamByPlaybackId(playbackId, &streams_entities.Stream{
		Title:    streamData.Title,
		Category: streamData.Category,
	})

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).Send([]byte("{}"))
	}

	return c.Status(fiber.StatusOK).Send([]byte("{}"))
}

// @title			Delete Stream
// @description	Delete the stream from the database
// @tags			Streams
// @router			/streams/delete-stream/:playbackId [delete]
// @param			playbackId	path string	true	"Playback ID of the stream"
func deleteStream(c *fiber.Ctx) error {
	playbackId := c.Params("playbackId")

	stream, err := streams_service.GetStreamByPlaybackId(playbackId)

	if err != nil {
		fmt.Println(err.Error())
		return c.Status(fiber.StatusInternalServerError).Send([]byte("{}"))
	}

	if stream.UserId == uuid.Nil {
		return c.Status(fiber.StatusNotFound).Send([]byte("{}"))
	}

	if stream.UserId != c.Locals("user").(*user_entities.User).ID {
		return c.Status(fiber.StatusUnauthorized).Send([]byte("{}"))
	}

	err = streams_service.DeleteStreamByPlaybackId(playbackId)

	if err != nil {
		fmt.Println(err.Error())
		return c.Status(fiber.StatusInternalServerError).Send([]byte("{}"))
	}

	return c.Status(fiber.StatusOK).Send([]byte("{}"))
}

type StreamCategoriesViewers struct {
	Category string `json:"category"`
	Viewers  int    `json:"viewers"`
}

// @title			Get Stream Categories Viewers
// @description	Get the number of viewers for each category
// @tags			Streams
// @router			/streams/categories/viewers [get]
func getStreamCategoriesViewers(c *fiber.Ctx) error {
	categories := make([]StreamCategoriesViewers, 0)

	for _, category := range streams_entities.StreamCategories {
		viewers, err := viewers_service.GetViewerCountByCategory(category.String())

		if err != nil {
			return c.Status(fiber.StatusInternalServerError).Send([]byte("{}"))
		}

		categories = append(categories, StreamCategoriesViewers{
			Category: category.String(),
			Viewers:  viewers,
		})
	}

	return c.JSON(categories)
}
