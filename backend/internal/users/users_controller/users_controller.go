package users_controller

import (
	"github.com/gofiber/fiber/v2"
	"github.com/waxer59/watchMe/internal/users/user_entities"
	"github.com/waxer59/watchMe/internal/users/users_service"
	"github.com/waxer59/watchMe/router/router_middlewares"
)

func New(router fiber.Router) {
	user := router.Group("/users")

	user.Use(router_middlewares.AuthMiddleware)
	user.Get("/", getUser)
	user.Post("/follow/:username", followUser)
	user.Post("/unfollow/:username", unfollowUser)
}

// @title			Get User
// @description	Get the user's information
// @tags			Users
// @router			/users [get]
func getUser(c *fiber.Ctx) error {
	user := c.Locals("user").(*user_entities.User)
	streamKeys, err := users_service.FindAllStreamKeysByUserId(user.ID)

	if err != nil {
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	user.StreamKeys = streamKeys

	return c.JSON(user)
}

// @title			Follow User
// @description	Follow a user
// @tags			Users
// @router			/users/follow/:username [post]
func followUser(c *fiber.Ctx) error {
	username := c.Params("username")
	return c.JSON(fiber.Map{
		"message": username,
	})
}

// @title			Unfollow User
// @description	Unfollow a user
// @tags			Users
// @router			/users/unfollow/:username [post]
func unfollowUser(c *fiber.Ctx) error {
	username := c.Params("username")
	return c.JSON(fiber.Map{
		"message": username,
	})
}
