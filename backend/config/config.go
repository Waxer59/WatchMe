package config

import (
	"github.com/gofiber/fiber/v2/middleware/session"
)

var FiberSession = session.New(session.Config{
	CookieHTTPOnly: true,
	CookieSecure:   true,
	KeyLookup:      "cookie:watchMe_session_id",
})
