package users_controller

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/waxer59/watchMe/internal/users/user_entities"
	"github.com/waxer59/watchMe/internal/users/users_service"
	"github.com/waxer59/watchMe/router/router_middlewares"
)

func New(router fiber.Router) {
	user := router.Group("/users")

	user.Use(router_middlewares.AuthMiddleware)
	user.Get("/", getUser)
	user.Patch("/", updateUser)
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
// @param			username	path string	true	"Username of the user"
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
// @param			username	path string	true	"Username of the user"
func unfollowUser(c *fiber.Ctx) error {
	username := c.Params("username")
	return c.JSON(fiber.Map{
		"message": username,
	})
}

// @title			Update User
// @description	Update a user's information
// @tags			Users
// @router			/users [patch]
func updateUser(c *fiber.Ctx) error {
	var user users_service.UpdateUser

	err := c.BodyParser(&user)

	if err != nil {
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	err = users_service.UpdateUserById(c.Locals("user").(*user_entities.User).ID.String(), users_service.UpdateUser{
		Username: user.Username,
		Avatar:   user.Avatar,
	})

	if err != nil {
		fmt.Println(err.Error())
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	return c.SendStatus(fiber.StatusOK)
}
