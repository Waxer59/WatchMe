package config

import (
	"github.com/gofiber/fiber/v2/middleware/session"
)

var FiberSession = session.New(session.Config{
	CookieHTTPOnly: true,
	CookieSecure:   true,
	KeyLookup:      "cookie:watchMe_session_id",
})

const MIN_USERNAME_LENGTH = 3
const MAX_USERNAME_LENGTH = 20
