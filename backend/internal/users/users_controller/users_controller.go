package users_controller

import (
	"github.com/gofiber/fiber/v2"
	"github.com/waxer59/watchMe/router/router_middlewares"
)

func New(router fiber.Router) {
	user := router.Group("/users")

	user.Use(router_middlewares.AuthMiddleware)
	user.Get("/", GetUser)
	user.Post("/follow", FollowUser)
	user.Post("/unfollow", UnfollowUser)
}

func GetUser(c *fiber.Ctx) error {
	return c.JSON(c.Locals("user"))
}

func FollowUser(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{
		"message": "Hello World!",
	})
}

func UnfollowUser(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{
		"message": "Hello World!",
	})
}
