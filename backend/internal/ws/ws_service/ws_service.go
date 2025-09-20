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
		HandleEmitViewersCountByStreamId(currentRoom, count)
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
		HandleEmitViewersCountByStreamId(currentRoom, count)
	}

	delete(Clients, ep.Kws.GetStringAttribute("user_id"))
}

func HandleEventJoinUserChannel(ep *socketio.EventPayload, msg MessageObject) {
	userId := ep.Kws.GetStringAttribute("user_id")

	roomId := msg.Data

	if roomId == nil {
		return
	}

	Rooms[roomId.(string)] = append(Rooms[roomId.(string)], Clients[userId])

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

	ep.Kws.SetAttribute("room_id", roomId)

	if isInDifferentRoom {
		// Remove the user from the previous room
		removeUserFromRoom(currentUserRoom, Clients[userId])
		count, err := viewers_service.DecrementViewerCount(currentUserRoom)

		if err != nil {
			fmt.Println(err.Error())
			return
		}

		HandleEmitViewersCountByStreamId(roomId.(string), count)
		return
	}

	count, err := viewers_service.IncrementViewerCount(roomId.(string))

	if err != nil {
		fmt.Println(err.Error())
		return
	}

	HandleEmitViewersCountByStreamId(roomId.(string), count)
}

func HandleEventLeaveUserChannel(ep *socketio.EventPayload, msg MessageObject) {
	currentRoom := ep.Kws.GetStringAttribute("room_id")
	userId := ep.Kws.GetStringAttribute("user_id")

	if currentRoom == "" {
		return
	}

	removeUserFromRoom(currentRoom, Clients[userId])

	count, err := viewers_service.DecrementViewerCount(currentRoom)

	if err != nil {
		fmt.Println(err.Error())
		return
	}

	HandleEmitViewersCountByStreamId(currentRoom, count)
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

func HandleEmitViewersCountByStreamId(streamId string, count int) {
	message := MessageObject{
		Data: struct {
			StreamId string `json:"stream_id"`
			Viewers  int    `json:"viewers"`
		}{
			StreamId: streamId,
			Viewers:  count,
		},
		Event: STREAM_VIEWERS_COUNT,
	}

	preparedMessage, err := json.Marshal(message)

	if err != nil {
		return
	}

	socketio.EmitToList(Rooms[streamId], preparedMessage)
}

func NotifyRoomUserStreaming(userId string, stream *streams_entities.Stream) {
	// If a user is not streaming, all users visiting their channel
	// are joined to a room whose id is the user’s id.
	// When the stream starts, all users who were in that room are notified
	// and moved to the new room whose id is the stream id.

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

	// Move all users in the room to the new room
	Rooms[stream.ID.String()] = Rooms[userId]

	// Set viewers count
	viewers_service.SetViewersByStreamId(stream.ID.String(), len(Rooms[stream.ID.String()]))

	// Notify viewers
	HandleEmitViewersCountByStreamId(stream.ID.String(), len(Rooms[stream.ID.String()]))

	// Delete the old room
	delete(Rooms, userId)
}

func NotifyRoomUserStopStreaming(userId string, streamId string) {
	notificationMessage := MessageObject{
		Data: struct {
			StreamId string `json:"stream_id"`
		}{
			StreamId: streamId,
		},
		Event: STREAM_OFF,
	}

	preparedMessage, err := json.Marshal(notificationMessage)

	if err != nil {
		return
	}

	socketio.EmitToList(Rooms[streamId], preparedMessage, socketio.TextMessage)

	// Move all users in the room to the new room
	Rooms[userId] = Rooms[streamId]

	delete(Rooms, streamId)
}
