package ws_service

import (
	"encoding/json"
	"fmt"
	"slices"

	"github.com/gofiber/contrib/socketio"
	"github.com/google/uuid"
	"github.com/waxer59/watchMe/internal/streams/streams_entities"
	"github.com/waxer59/watchMe/internal/users/user_entities"
	"github.com/waxer59/watchMe/internal/viewers/viewers_service"
)

const (
	JOIN_USER_CHANNEL    = "join-user-channel"
	LEAVE_USER_CHANNEL   = "leave-user-channel"
	SEND_MESSAGE         = "send-message"
	STREAM_VIEWERS_COUNT = "stream-viewers-count"
	STREAM_ON            = "stream-on"
	STREAM_OFF           = "stream-off"
)

type MessageObject struct {
	Data  any    `json:"data"`
	Event string `json:"event"`
}

var Clients = make(map[string]string)
var Rooms = make(map[string][]string)

func HandleEventDisconnect(ep *socketio.EventPayload) {
	currentRoom := ep.Kws.GetStringAttribute("room_id")
	userId := ep.Kws.GetStringAttribute("user_id")

	if currentRoom != "" {
		removeUserFromRoom(currentRoom, Clients[userId])
		count, err := viewers_service.DecrementViewerCount(currentRoom)

		if err != nil {
			fmt.Println(err.Error())
			return
		}
		HandleEmitViewersCountByUserId(currentRoom, count)
	}

	delete(Clients, ep.Kws.GetStringAttribute("user_id"))
}

func HandleEventClose(ep *socketio.EventPayload) {
	currentRoom := ep.Kws.GetStringAttribute("room_id")
	userId := ep.Kws.GetStringAttribute("user_id")

	if currentRoom != "" {
		removeUserFromRoom(currentRoom, Clients[userId])
		count, err := viewers_service.DecrementViewerCount(currentRoom)

		if err != nil {
			fmt.Println(err.Error())
			return
		}
		HandleEmitViewersCountByUserId(currentRoom, count)
	}

	delete(Clients, ep.Kws.GetStringAttribute("user_id"))
}

func HandleEventJoinUserChannel(ep *socketio.EventPayload, msg MessageObject) {
	userId := ep.Kws.GetStringAttribute("user_id")

	roomId := msg.Data

	if roomId == nil {
		return
	}

	oldUserRoom := ep.Kws.GetStringAttribute("room_id")

	isAlreadyInRoom := oldUserRoom == roomId
	isInDifferentRoom := oldUserRoom != "" && oldUserRoom != roomId

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
		removeUserFromRoom(oldUserRoom, Clients[userId])

		// Decrement the viewer count & notify old room
		count, err := viewers_service.DecrementViewerCount(oldUserRoom)

		if err != nil {
			fmt.Println(err.Error())
			return
		}

		HandleEmitViewersCountByUserId(oldUserRoom, count)
	}

	ep.Kws.SetAttribute("room_id", roomId)
	Rooms[roomId.(string)] = append(Rooms[roomId.(string)], Clients[userId])

	count, err := viewers_service.IncrementViewerCount(roomId.(string))

	if err != nil {
		fmt.Println(err.Error())
		return
	}

	HandleEmitViewersCountByUserId(roomId.(string), count)
}

func HandleEventLeaveUserChannel(ep *socketio.EventPayload, msg MessageObject) {
	currentRoom := ep.Kws.GetStringAttribute("room_id")
	userId := ep.Kws.GetStringAttribute("user_id")

	if currentRoom == "" {
		return
	}

	ep.Kws.SetAttribute("room_id", "")
	removeUserFromRoom(currentRoom, Clients[userId])

	count, err := viewers_service.DecrementViewerCount(currentRoom)

	if err != nil {
		fmt.Println(err.Error())
		return
	}

	HandleEmitViewersCountByUserId(currentRoom, count)
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

	for _, clientId := range Rooms[roomId] {
		// Omit sender
		if reverseClientIdSearch(clientId) == user.ID.String() {
			continue
		}

		usersToSendMessage = append(usersToSendMessage, clientId)
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

func removeUserFromRoom(roomId string, userId string) {
	users, ok := Rooms[roomId]

	if !ok {
		return
	}

	userIdx := slices.Index(users, userId)
	if userIdx == -1 {
		return
	}

	Rooms[roomId] = append(users[:userIdx], users[userIdx+1:]...)

	if len(Rooms[roomId]) == 0 {
		delete(Rooms, roomId)
	}
}

func HandleEmitViewersCountByUserId(userId string, count int) {
	message := MessageObject{
		Data: struct {
			Viewers int `json:"viewers"`
		}{
			Viewers: count,
		},
		Event: STREAM_VIEWERS_COUNT,
	}

	preparedMessage, err := json.Marshal(message)

	if err != nil {
		return
	}

	socketio.EmitToList(Rooms[userId], preparedMessage)
}

func NotifyRoomUserStreaming(userId string, stream *streams_entities.Stream) {
	notificationMessage := MessageObject{
		Data: struct {
			Stream *streams_entities.Stream `json:"stream"`
		}{
			Stream: stream,
		},
		Event: STREAM_ON,
	}

	preparedMessage, err := json.Marshal(notificationMessage)

	if err != nil {
		return
	}

	// Notify all users in the room
	socketio.EmitToList(Rooms[userId], preparedMessage, socketio.TextMessage)

	// Set viewers count
	err = viewers_service.SetViewersByUserId(userId, len(Rooms[userId]))

	if err != nil {
		fmt.Println(err.Error())
		return
	}

	// Notify viewers
	HandleEmitViewersCountByUserId(userId, len(Rooms[userId]))
}

func NotifyRoomUserStopStreaming(userId string) {
	notificationMessage := MessageObject{
		Event: STREAM_OFF,
	}

	preparedMessage, err := json.Marshal(notificationMessage)

	if err != nil {
		return
	}

	socketio.EmitToList(Rooms[userId], preparedMessage, socketio.TextMessage)
}

// All clients are identified by an internal UUID that's used by fiber/socketio
// to send messages to the client. This function is used to reverse the search
// and find the client's DB UUID from the internal UUID.
func reverseClientIdSearch(clientIdToSearch string) string {
	for userId, clientId := range Clients {
		if clientId == clientIdToSearch {
			return userId
		}
	}

	return ""
}
