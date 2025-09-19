package ws_service

import (
	"encoding/json"
	"slices"

	"github.com/gofiber/contrib/socketio"
	"github.com/google/uuid"
	"github.com/waxer59/watchMe/internal/users/user_entities"
	"github.com/waxer59/watchMe/internal/viewers/viewers_service"
)

const (
	JOIN_USER_CHANNEL    = "join-user-channel"
	LEAVE_USER_CHANNEL   = "leave-user-channel"
	SEND_MESSAGE         = "send-message"
	STREAM_VIEWERS_COUNT = "stream-viewers-count"
)

type MessageObject struct {
	Data  any    `json:"data"`
	Event string `json:"event"`
}

var Clients = make(map[string]string)
var Rooms = make(map[string][]string)

func HandleEventDisconnect(ep *socketio.EventPayload) {
	delete(Clients, ep.Kws.GetStringAttribute("user_id"))
}

func HandleEventClose(ep *socketio.EventPayload) {
	delete(Clients, ep.Kws.GetStringAttribute("user_id"))
}

func HandleEventJoinUserChannel(ep *socketio.EventPayload, msg MessageObject) {
	userId := ep.Kws.GetStringAttribute("user_id")

	roomId := msg.Data

	if _, ok := Rooms[roomId.(string)]; !ok {
		Rooms[roomId.(string)] = []string{}
	}

	currentUserRoom := ep.Kws.GetStringAttribute("room_id")
	isAlreadyInRoom := currentUserRoom == roomId
	isInDifferentRoom := currentUserRoom != "" && currentUserRoom != roomId

	if isAlreadyInRoom {
		return
	}

	// To prevent a client being in multiple rooms
	// we have to make sure that the client is not
	// already in another room, in that case we
	// have to remove the client from the previous room
	// and add it to the new room

	if isInDifferentRoom {
		// Remove the user from the previous room
		Rooms[currentUserRoom] = slices.Delete(Rooms[currentUserRoom], slices.Index(Rooms[currentUserRoom], userId), 1)
		viewers_service.DecrementViewerCount(currentUserRoom)
		roomCleanup(currentUserRoom)
	}

	Rooms[roomId.(string)] = append(Rooms[roomId.(string)], userId)
	ep.Kws.SetAttribute("room_id", roomId)
	viewers_service.IncrementViewerCount(roomId.(string))
}

func HandleEventLeaveUserChannel(ep *socketio.EventPayload, msg MessageObject) {
	currentRoom := ep.Kws.GetStringAttribute("room_id")
	userId := ep.Kws.GetStringAttribute("user_id")

	if currentRoom == "" {
		return
	}

	userIdx := slices.Index(Rooms[currentRoom], userId)

	if userIdx == -1 {
		return
	}

	Rooms[currentRoom] = slices.Delete(Rooms[currentRoom], userIdx, 1)
	viewers_service.DecrementViewerCount(currentRoom)
	roomCleanup(currentRoom)
}

func HandleEventSendMessage(ep *socketio.EventPayload, msg MessageObject) {
	// To send a message in a stream its necessary to
	// 1. Be authenticated
	// 2. Be in a room
	isAuthenticated := ep.Kws.GetStringAttribute("is_authenticated") == "true"
	roomId := ep.Kws.GetStringAttribute("room_id")

	if !isAuthenticated || roomId == "" {
		return
	}

	user := ep.Kws.Locals("user").(*user_entities.User)

	usersToSendMessage := make([]string, 0)

	for _, userId := range Rooms[roomId] {
		if userId == ep.Kws.GetStringAttribute("user_id") {
			continue
		}

		usersToSendMessage = append(usersToSendMessage, userId)
	}

	msgSend := MessageObject{
		Data: struct {
			ID            string `json:"id"`
			Message       string `json:"message"`
			UserId        string `json:"user_id"`
			UserName      string `json:"user_name"`
			PresenceColor string `json:"presence_color"`
		}{
			ID:            uuid.New().String(),
			Message:       msg.Data.(string),
			UserId:        user.ID.String(),
			UserName:      user.Username,
			PresenceColor: user.PresenceColor,
		},
		Event: SEND_MESSAGE,
	}

	preparedMessage, err := json.Marshal(msgSend)

	if err != nil {
		return
	}

	ep.Kws.EmitToList(usersToSendMessage, preparedMessage, socketio.TextMessage)
}

func roomCleanup(roomId string) {
	if len(Rooms[roomId]) == 0 {
		delete(Rooms, roomId)
	}
}
