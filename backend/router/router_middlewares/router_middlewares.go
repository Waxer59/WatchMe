package router_middlewares

import (
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/waxer59/watchMe/internal/auth/auth_controller"
	"github.com/waxer59/watchMe/internal/users/users_service"
	"github.com/waxer59/watchMe/pkg/utils/jwt_utils"
)

func AuthMiddleware(c *fiber.Ctx) error {
	cookie := c.Cookies(auth_controller.CookieAuth)

	jwtToken, err := jwt_utils.ParseJwtToken(cookie)

	if err != nil {
		return c.Status(fiber.StatusUnauthorized).Send([]byte("{}"))
	}

	user, err := users_service.GetUserById(jwtToken["id"].(string))

	if err != nil || user.ID == uuid.Nil {
		return c.Status(fiber.StatusUnauthorized).Send([]byte("{}"))
	}

	// Add user to context
	c.Locals("user", user)

	return c.Next()
}

func OptionalAuthMiddleware(c *fiber.Ctx) error {
	cookie := c.Cookies(auth_controller.CookieAuth)

	if cookie == "" {
		return c.Next()
	}

	jwtToken, err := jwt_utils.ParseJwtToken(cookie)

	if err != nil {
		return c.Status(fiber.StatusUnauthorized).Send([]byte("{}"))
	}

	user, err := users_service.GetUserById(jwtToken["id"].(string))

	if err != nil || user.ID == uuid.Nil {
		return c.Status(fiber.StatusUnauthorized).Send([]byte("{}"))
	}

	// Add user to context
	c.Locals("user", user)

	return c.Next()
}
