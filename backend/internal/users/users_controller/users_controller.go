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

	followingUsers, err := users_service.FindAllFollowingUsersByUserId(user.ID)

	if err != nil {
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	user.StreamKeys = streamKeys

	for _, followingUser := range followingUsers {
		// Prevent giving the following user's sensitive info as stream keys
		user.Following = append(user.Following, user_entities.User{
			ID:          followingUser.ID,
			Username:    followingUser.Username,
			Avatar:      followingUser.Avatar,
			IsStreaming: followingUser.IsStreaming,
			Streams:     followingUser.Streams,
		})
	}

	return c.JSON(user)
}

// @title			Follow User
// @description	Follow a user
// @tags			Users
// @router			/users/follow/:username [post]
// @param			username	path string	true	"Username of the user to follow"
func followUser(c *fiber.Ctx) error {
	username := c.Params("username")

	err := users_service.FollowUserByUsername(c.Locals("user").(*user_entities.User), username)

	if err != nil {
		fmt.Println(err.Error())
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	return c.SendStatus(fiber.StatusOK)
}

// @title			Unfollow User
// @description	Unfollow a user
// @tags			Users
// @router			/users/unfollow/:username [post]
// @param			username	path string	true	"Username of the user to unfollow"
func unfollowUser(c *fiber.Ctx) error {
	username := c.Params("username")

	err := users_service.UnfollowUserByUsername(c.Locals("user").(*user_entities.User), username)

	if err != nil {
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	return c.SendStatus(fiber.StatusOK)
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

	err = users_service.UpdateUserById(c.Locals("user").(*user_entities.User).ID, users_service.UpdateUser{
		Username:      user.Username,
		Avatar:        user.Avatar,
		PresenceColor: user.PresenceColor,
	})

	if err != nil {
		fmt.Println(err.Error())
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	return c.SendStatus(fiber.StatusOK)
}
