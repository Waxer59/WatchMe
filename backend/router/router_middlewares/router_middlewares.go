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
		return c.SendStatus(fiber.StatusUnauthorized)
	}

	user, err := users_service.GetUserById(jwtToken["id"].(string))

	if err != nil || user.ID == uuid.Nil {
		return c.SendStatus(fiber.StatusUnauthorized)
	}

	// Add user to context
	c.Locals("user", user)

	return c.Next()
}
