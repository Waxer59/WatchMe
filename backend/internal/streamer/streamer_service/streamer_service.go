package streamer_service

import (
	"github.com/waxer59/watchMe/internal/users/users_service"
)

type Streamer struct {
	ID             string `json:"id"`
	Username       string `json:"username"`
	Avatar         string `json:"avatar"`
	Followers      int64  `json:"followers"`
	Presence_color string `json:"presence_color"`
}

func GetStreamer(username string) (*Streamer, error) {
	streamer, err := users_service.FindUserByUsername(username)

	if err != nil {
		return nil, err
	}

	if streamer == nil {
		return nil, nil
	}

	followersCount, err := users_service.GetFollowersCount(username)

	if err != nil {
		return nil, err
	}

	return &Streamer{
		ID:             streamer.ID.String(),
		Username:       streamer.Username,
		Avatar:         streamer.Avatar,
		Followers:      followersCount,
		Presence_color: streamer.PresenceColor,
	}, nil
}
