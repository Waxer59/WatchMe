package streamer_service

import (
	"github.com/waxer59/watchMe/internal/streams/streams_entities"
	"github.com/waxer59/watchMe/internal/streams/streams_service"
	"github.com/waxer59/watchMe/internal/users/users_service"
)

type Streamer struct {
	ID             string                    `json:"id"`
	Username       string                    `json:"username"`
	Avatar         string                    `json:"avatar"`
	Followers      int64                     `json:"followers"`
	Presence_color string                    `json:"presence_color"`
	Streams        []streams_entities.Stream `json:"streams"`
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

	streams, err := streams_service.GetStreamsByUserId(streamer.ID)

	if err != nil {
		return nil, err
	}

	streamsToInclude := []streams_entities.Stream{}

	for _, stream := range streams {
		if !stream.IsUploadDone {
			continue
		}

		streamsToInclude = append(streamsToInclude, stream)
	}

	return &Streamer{
		ID:             streamer.ID.String(),
		Username:       streamer.Username,
		Avatar:         streamer.Avatar,
		Followers:      followersCount,
		Presence_color: streamer.PresenceColor,
		Streams:        streamsToInclude,
	}, nil
}
