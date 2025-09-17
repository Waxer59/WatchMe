package config

import (
	"os"

	"github.com/gofiber/fiber/v2/middleware/session"
	muxgo "github.com/muxinc/mux-go/v6"
)

var FiberSession = session.New(session.Config{
	CookieHTTPOnly: true,
	CookieSecure:   true,
	KeyLookup:      "cookie:watchMe_session_id",
})

const MIN_USERNAME_LENGTH = 3
const MAX_USERNAME_LENGTH = 20

func GetMuxClient() *muxgo.APIClient {
	return muxgo.NewAPIClient(
		muxgo.NewConfiguration(
			muxgo.WithBasicAuth(os.Getenv("MUX_TOKEN_ID"), os.Getenv("MUX_SECRET_KEY")),
		),
	)
}
