package users_controller

import "github.com/gofiber/fiber/v2"

func New(router fiber.Router) {
	user := router.Group("/user")

	user.Get("/", GetUser)
	user.Post("/follow", FollowUser)
	user.Post("/unfollow", UnfollowUser)
}

func GetUser(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{
		"message": "Hello World!",
	})
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
