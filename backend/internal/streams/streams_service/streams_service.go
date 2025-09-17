package streams_service

import (
	"fmt"
	"os"

	"github.com/google/uuid"
	muxgo "github.com/muxinc/mux-go/v6"
	"github.com/waxer59/watchMe/database"
	"github.com/waxer59/watchMe/internal/streams/streams_entities"
	"github.com/waxer59/watchMe/internal/users/users_service"
)

type StreamFeed struct {
	Title      string `json:"title"`
	Username   string `json:"username"`
	Avatar     string `json:"avatar"`
	Category   string `json:"category"`
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
			Title:      stream.Title,
			Category:   stream.Category,
			Username:   user.Username,
			Avatar:     user.Avatar,
			PlaybackId: stream.PlaybackId,
		})
	}

	return streamsFeed, nil
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

func GetStreamInProgressByUserId(userId uuid.UUID) (*streams_entities.Stream, error) {
	db := database.DB

	var stream streams_entities.Stream

	err := db.Find(&stream, "user_id = ? and is_completed = ?", userId, false).Error

	if err != nil {
		return nil, err
	}

	return &stream, nil
}

func UpdateStreamById(id uuid.UUID, stream *streams_entities.Stream) error {
	db := database.DB

	updateField := map[string]interface{}{}

	if stream.Title != "" {
		updateField["title"] = stream.Title
	}

	if stream.PlaybackId != "" {
		updateField["playback_id"] = stream.PlaybackId
	}

	if stream.Category != "" {
		updateField["category"] = stream.Category
	}

	if stream.Viewers != 0 {
		updateField["viewers"] = stream.Viewers
	}

	if stream.IsCompleted {
		updateField["is_completed"] = stream.IsCompleted
	}

	updateField["is_upload_done"] = stream.IsUploadDone

	err := db.Model(&streams_entities.Stream{
		ID: id,
	}).Updates(updateField).Error

	if err != nil {
		fmt.Println(err.Error())
		return err
	}

	return nil
}

func GetNonUploadedStreamByLiveStreamId(liveStreamId string) (*streams_entities.Stream, error) {
	db := database.DB

	var stream streams_entities.Stream

	err := db.Find(&stream, "live_stream_id = ? and is_upload_done = ?", liveStreamId, false).Error

	if err != nil {
		return nil, err
	}

	return &stream, nil
}

func GetStreamsByUserId(userId uuid.UUID) ([]streams_entities.Stream, error) {
	db := database.DB

	var streams []streams_entities.Stream

	err := db.Find(&streams, "user_id = ?", userId).Error

	if err != nil {
		return nil, err
	}

	return streams, nil
}

func GetStreamByPlaybackId(playbackId string) (*streams_entities.Stream, error) {
	db := database.DB

	var stream streams_entities.Stream

	err := db.Find(&stream, "playback_id = ?", playbackId).Error

	if err != nil {
		return nil, err
	}

	return &stream, nil
}

func EditStreamByPlaybackId(playbackId string, stream *streams_entities.Stream) error {
	db := database.DB

	updateFields := map[string]interface{}{}

	if stream.Title != "" {
		updateFields["title"] = stream.Title
	}

	if stream.Category != "" {
		updateFields["category"] = stream.Category
	}

	err := db.Table("streams").Where("playback_id = ?", playbackId).Updates(updateFields).Error

	if err != nil {
		return err
	}

	return nil
}
