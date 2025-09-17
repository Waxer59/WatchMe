package streamer_controller

import (
	"sort"

	"github.com/gofiber/fiber/v2"
	"github.com/waxer59/watchMe/internal/streamer/streamer_service"
	"github.com/waxer59/watchMe/internal/users/user_entities"
	"github.com/waxer59/watchMe/internal/users/users_service"
	"github.com/waxer59/watchMe/router/router_middlewares"
)

func New(router fiber.Router) {
	group := router.Group("/streamer")

	group.Use(router_middlewares.OptionalAuthMiddleware)
	group.Get("/search/:username", getSearchStreamer)
	group.Get("/:username", getStreamer)
}

// @title			Get Streamer
// @description	Get the streamer's information
// @tags			Streamer
// @router			/streamer/:username [get]
// @param			username	path string	true	"Username of the user"
func getStreamer(c *fiber.Ctx) error {
	username := c.Params("username")

	streamer, err := streamer_service.GetStreamer(username)

	if err != nil {
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	if streamer == nil {
		return c.SendStatus(fiber.StatusNotFound)
	}

	// Order streams by created_at DESC
	sort.Slice(streamer.Streams, func(i, j int) bool {
		return streamer.Streams[i].CreatedAt.After(streamer.Streams[j].CreatedAt)
	})

	return c.JSON(streamer)
}

// @title			Get Search Streamer
// @description	Get the streamer's information
// @tags			Streamer
// @router			/streamer/search/:username [get]
// @param			username	path string	true	"Username of the user"
func getSearchStreamer(c *fiber.Ctx) error {
	username := c.Params("username")

	users, err := users_service.FindUsernameSearch(username)

	if err != nil {
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	usersFound := []user_entities.User{}

	for _, searchUser := range users {
		// Prevent giving the following user's sensitive info as stream keys
		usersFound = append(usersFound, user_entities.User{
			ID:            searchUser.ID,
			Username:      searchUser.Username,
			Avatar:        searchUser.Avatar,
			IsStreaming:   searchUser.IsStreaming,
			Streams:       searchUser.Streams,
			PresenceColor: searchUser.PresenceColor,
		})
	}

	return c.JSON(usersFound)
}
