package streams_service

import (
	"os"

	muxgo "github.com/muxinc/mux-go/v6"
	"github.com/waxer59/watchMe/database"
	"github.com/waxer59/watchMe/internal/streams/streams_entities"
	"github.com/waxer59/watchMe/internal/users/users_service"
)

type StreamFeed struct {
	Title      string `json:"title"`
	Username   string `json:"username"`
	Avatar     string `json:"avatar"`
	PlaybackId string `json:"playback_id"`
}

var muxClient = muxgo.NewAPIClient(
	muxgo.NewConfiguration(
		muxgo.WithBasicAuth(os.Getenv("MUX_ACCESS_TOKEN"), os.Getenv("MUX_SECRET_KEY")),
	),
)

func GenerateStreamKey(channelId string) (muxgo.LiveStreamResponse, error) {
	streamParams, err := muxClient.LiveStreamsApi.CreateLiveStream(muxgo.CreateLiveStreamRequest{
		PlaybackPolicy: []muxgo.PlaybackPolicy{muxgo.PUBLIC},
		LatencyMode:    "low",
		NewAssetSettings: muxgo.CreateAssetRequest{
			PlaybackPolicy: []muxgo.PlaybackPolicy{muxgo.PUBLIC},
		},
	})

	return streamParams, err
}

func GetStreamFeed() ([]StreamFeed, error) {
	usersStreaming, err := users_service.GetUsersStreaming()

	if err != nil {
		return nil, err
	}

	streamsFeed := []StreamFeed{}

	for _, user := range usersStreaming {
		stream, err := GetLiveStreamByUsername(user.Username)

		if err != nil {
			return nil, err
		}

		streamsFeed = append(streamsFeed, StreamFeed{
			Title:      user.Username, // TODO: Add title
			Username:   user.Username,
			Avatar:     user.Avatar,
			PlaybackId: stream.PlaybackId,
		})
	}

	return streamsFeed, nil
}

func GetStreams() ([]streams_entities.Stream, error) {
	db := database.DB

	var streams []streams_entities.Stream

	err := db.Find(&streams).Error

	if err != nil {
		return nil, err
	}

	return streams, nil
}

func DeleteStreamKey(streamKeyId string) error {
	err := muxClient.LiveStreamsApi.DeleteLiveStream(streamKeyId)

	return err
}

func CreateStream(stream *streams_entities.Stream) error {
	db := database.DB

	err := db.Create(stream).Error

	if err != nil {
		return err
	}

	return nil
}

func GetLiveStreamByUsername(username string) (*streams_entities.Stream, error) {
	db := database.DB

	var stream streams_entities.Stream

	user, err := users_service.FindUserByUsername(username)

	if user == nil {
		return nil, nil
	}

	if err != nil {
		return nil, err
	}

	err = db.Find(&stream, "user_id = ? and is_completed = ?", user.ID, false).Error

	if err != nil {
		return nil, err
	}

	return &stream, nil
}
