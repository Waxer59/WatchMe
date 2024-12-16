package auth_service

import (
	"encoding/json"
	"errors"
	"fmt"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/waxer59/watchMe/config"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/github"
	"io"
	"net/http"
)

type GithubUser struct {
	ID        int    `json:"id"`
	Login     string `json:"login"`
	AvatarURL string `json:"avatar_url"`
}

const (
	GithubOauthState = "github_oauth_state"
)

var oauthConf = &oauth2.Config{
	ClientID:     config.GetEnv("OAUTH_GITHUB_CLIENT_ID"),
	ClientSecret: config.GetEnv("OAUTH_GITHUB_CLIENT_SECRET"),
	RedirectURL:  config.GetEnv("OAUTH_GITHUB_REDIRECT_URL"),
	Endpoint:     github.Endpoint,
	Scopes:       []string{"user"},
}

func GithubLogin(c *fiber.Ctx) (string, error) {
	sess, err := config.FiberSession.Get(c)

	if err != nil {
		return "", err
	}

	state := uuid.New().String()

	sess.Set(GithubOauthState, state)

	if err := sess.Save(); err != nil {
		return "", err
	}

	url := oauthConf.AuthCodeURL(state, oauth2.AccessTypeOnline)

	return url, nil
}

func GithubCallback(c *fiber.Ctx) (*oauth2.Token, error) {
	sess, err := config.FiberSession.Get(c)

	if err != nil {
		return nil, err
	}

	state := sess.Get(GithubOauthState)

	if state == nil {
		return nil, errors.New("state not found")
	}

	tok, err := oauthConf.Exchange(c.Context(), c.Query("code"))

	if err != nil {
		return nil, err
	}

	if err := sess.Destroy(); err != nil {
		return nil, err
	}

	return tok, nil
}

func GetGithubUser(token *oauth2.Token) (*GithubUser, error) {
	req, err := http.NewRequest("GET", "https://api.github.com/user", nil)

	if err != nil {
		return nil, err
	}

	req.Header.Set("Authorization", fmt.Sprintf("token %s", token.AccessToken))

	client := http.Client{}

	resp, err := client.Do(req)

	if err != nil {
		return nil, err
	}

	defer func(Body io.ReadCloser) {
		err := Body.Close()
		if err != nil {
			fmt.Println(err)
		}
	}(resp.Body)

	var user GithubUser

	err = json.NewDecoder(resp.Body).Decode(&user)

	return &user, err
}
