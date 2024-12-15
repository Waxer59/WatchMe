package auth_controller

import (
	"fmt"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"github.com/waxer59/watchMe/config"
	"github.com/waxer59/watchMe/internal/auth/auth_service"
	"github.com/waxer59/watchMe/internal/users/user_entities"
	"github.com/waxer59/watchMe/internal/users/users_service"
	"strconv"
	"time"
)

const (
	CookieAuth     = "watchMe_auth"
	AuthExpiration = 7 * 24 * 3600 //s (7 days)
)

func New(router fiber.Router) {
	auth := router.Group("/auth")

	auth.Get("/github", githubLogin)
	auth.Get("/github/callback", githubCallback)
}

func githubLogin(c *fiber.Ctx) error {
	url, err := auth_service.GithubLogin(c)

	if err != nil {
		fmt.Println(err.Error())
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	return c.Redirect(url)
}

func githubCallback(c *fiber.Ctx) error {
	token, err := auth_service.GithubCallback(c)

	if err != nil {
		fmt.Println(err.Error())
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	profile, err := auth_service.GetGithubUser(token)

	if err != nil {
		fmt.Println(err.Error())
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	profileIdString := strconv.Itoa(profile.ID)

	user, err := users_service.CreateGithubUser(&user_entities.User{
		Username:        profile.Login,
		Avatar:          profile.AvatarURL,
		GithubAccountId: &profileIdString,
	})

	if err != nil {
		fmt.Println(err.Error())
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	jwtToken, err := generateJwtToken(user.ID.String())

	if err != nil {
		fmt.Println(err.Error())
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	c.Cookie(&fiber.Cookie{
		Name:     CookieAuth,
		Value:    jwtToken,
		HTTPOnly: true,
		Secure:   true,
		Expires:  time.Now().Add(AuthExpiration * time.Second),
		SameSite: fiber.CookieSameSiteStrictMode,
	})

	return c.Redirect(config.GetEnv("FRONTEND_URL"))
}

func generateJwtToken(id string) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id": id,
	})

	tokenString, err := token.SignedString([]byte(config.GetEnv("JWT_SECRET_KEY")))

	if err != nil {
		return "", err
	}

	return tokenString, nil
}
