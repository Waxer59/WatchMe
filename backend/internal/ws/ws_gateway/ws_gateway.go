package ws_gateway

import (
	"encoding/json"

	"github.com/gofiber/contrib/socketio"
	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/waxer59/watchMe/internal/users/user_entities"
	"github.com/waxer59/watchMe/internal/ws/ws_service"
	"github.com/waxer59/watchMe/router/router_middlewares"
)

func New(app *fiber.App) {
	app.Use(router_middlewares.OptionalAuthMiddleware, func(c *fiber.Ctx) error {
		// IsWebSocketUpgrade returns true if the client
		// requested upgrade to the WebSocket protocol.
		if websocket.IsWebSocketUpgrade(c) {
			c.Locals("allowed", true)
			return c.Next()
		}
		return fiber.ErrUpgradeRequired
	})

	app.Get("/ws", socketio.New(func(kws *socketio.Websocket) {
		// Retrieve the user id from endpoint
		userId := uuid.New().String()
		user := kws.Locals("user")

		if user != nil {
			userId = user.(*user_entities.User).ID.String()
			kws.SetAttribute("is_authenticated", true)
		}

		// Add the connection to the list of the connected clients
		// The UUID is generated randomly and is the key that allow
		// socketio to manage Emit/EmitTo/Broadcast
		ws_service.Clients[userId] = kws.UUID

		// Every websocket connection has an optional session key => value storage
		kws.SetAttribute("user_id", userId)
	}))

	socketio.On(socketio.EventDisconnect, ws_service.HandleEventDisconnect)
	socketio.On(socketio.EventClose, ws_service.HandleEventClose)

	socketio.On(socketio.EventMessage, func(ep *socketio.EventPayload) {
		var message ws_service.MessageObject

		err := json.Unmarshal(ep.Data, &message)

		if err != nil {
			return
		}

		event := message.Event

		switch event {
		case ws_service.JOIN_USER_CHANNEL:
			ws_service.HandleEventJoinUserChannel(ep, message)
		case ws_service.LEAVE_USER_CHANNEL:
			ws_service.HandleEventLeaveUserChannel(ep, message)
		case ws_service.SEND_MESSAGE:
			ws_service.HandleEventSendMessage(ep, message)
		}
	})
}
