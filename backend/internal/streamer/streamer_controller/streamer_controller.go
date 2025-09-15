package streamer_controller

import (
	"github.com/gofiber/fiber/v2"
	"github.com/waxer59/watchMe/internal/streamer/streamer_service"
	"github.com/waxer59/watchMe/internal/users/user_entities"
	"github.com/waxer59/watchMe/router/router_middlewares"
)

func New(router fiber.Router) {
	group := router.Group("/streamer")

	group.Use(router_middlewares.OptionalAuthMiddleware)
	group.Get("/:username", getStreamer)
}

// @title			Get Streamer
// @description	Get the streamer's information
// @tags			Streamer
// @router			/streamer/:username [get]
// @param			username	path string	true	"Username of the user"
func getStreamer(c *fiber.Ctx) error {
	username := c.Params("username")

	var user *user_entities.User

	if c.Locals("user") != nil {
		user = c.Locals("user").(*user_entities.User)
	}

	streamer, err := streamer_service.GetStreamer(username, user)

	if err != nil {
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	if streamer == nil {
		return c.SendStatus(fiber.StatusNotFound)
	}

	return c.JSON(streamer)
}
