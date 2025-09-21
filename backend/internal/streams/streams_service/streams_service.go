package streams_service

import (
	"errors"
	"fmt"

	"github.com/google/uuid"
	muxgo "github.com/muxinc/mux-go/v6"
	"github.com/waxer59/watchMe/config"
	"github.com/waxer59/watchMe/database"
	"github.com/waxer59/watchMe/internal/streamer/streamer_cache"
	"github.com/waxer59/watchMe/internal/streams/streams_entities"
	"github.com/waxer59/watchMe/internal/users/users_service"
	"github.com/waxer59/watchMe/internal/viewers/viewers_service"
)

type StreamFeed struct {
	Title      string `json:"title"`
	Username   string `json:"username"`
	Avatar     string `json:"avatar"`
	Category   string `json:"category"`
	PlaybackId string `json:"playback_id"`
	Viewers    int64  `json:"viewers"`
}

func GenerateStreamKey(channelId string) (muxgo.LiveStreamResponse, error) {
	muxClient := config.GetMuxClient()

	streamParams, err := muxClient.LiveStreamsApi.CreateLiveStream(muxgo.CreateLiveStreamRequest{
		PlaybackPolicy: []muxgo.PlaybackPolicy{muxgo.PUBLIC},
		LatencyMode:    "low",
		NewAssetSettings: muxgo.CreateAssetRequest{
			PlaybackPolicy: []muxgo.PlaybackPolicy{muxgo.PUBLIC},
		},
	})

	return streamParams, err
}

func GetStreamFeed(category *string) ([]StreamFeed, error) {
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

		if category != nil && *category != "" && *category != stream.Category {
			continue
		}

		viewers, err := viewers_service.GetViewerCount(user.ID.String())

		if err != nil {
			return nil, err
		}

		streamsFeed = append(streamsFeed, StreamFeed{
			Title:      stream.Title,
			Category:   stream.Category,
			Username:   user.Username,
			Avatar:     user.Avatar,
			PlaybackId: stream.PlaybackId,
			Viewers:    viewers,
		})
	}

	return streamsFeed, nil
}

func DeleteStreamKey(streamKeyId string) error {
	muxClient := config.GetMuxClient()

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

	streamingId, err := streamer_cache.GetStreamingIdByUserId(user.ID.String())

	if err != nil {
		return nil, err
	}

	err = db.Find(&stream, "id = ?", streamingId).Error

	if err != nil {
		return nil, err
	}

	viewers, err := viewers_service.GetViewerCount(user.ID.String())

	if err != nil {
		return nil, err
	}

	stream.Viewers = viewers

	return &stream, nil
}

func GetLatestNonUploadedStream(userId uuid.UUID) (*streams_entities.Stream, error) {
	db := database.DB

	var stream streams_entities.Stream

	err := db.
		Where("user_id = ? AND is_upload_done = ?", userId, false).
		Order("created_at DESC").
		First(&stream).Error

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

		user, err := users_service.GetUserById(stream.UserId.String())

		if err != nil {
			return err
		}

		if !stream.IsUploadDone {
			viewers_service.ChangeCategoryViewerCount(user.ID.String(), stream.Category)
		}
	}

	if stream.AssetId != "" {
		updateField["asset_id"] = stream.AssetId
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

func GetLatestNonUploadedStreamByLiveStreamId(liveStreamId string) (*streams_entities.Stream, error) {
	db := database.DB

	var stream streams_entities.Stream

	err := db.
		Where("live_stream_id = ? AND is_upload_done = ?", liveStreamId, false).
		Order("created_at DESC").
		First(&stream).Error

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

func DeleteStreamByPlaybackId(playbackId string) error {
	db := database.DB
	muxClient := config.GetMuxClient()

	stream, err := GetStreamByPlaybackId(playbackId)

	if err != nil {
		return err
	}

	if stream.UserId == uuid.Nil {
		return errors.New("stream not found")
	}

	err = muxClient.AssetsApi.DeleteAsset(stream.AssetId)

	if err != nil {
		return err
	}

	err = db.Table("streams").Where("playback_id = ?", playbackId).Delete(&streams_entities.Stream{}).Error

	if err != nil {
		return err
	}

	return nil
}

func GetStreamById(id uuid.UUID) (*streams_entities.Stream, error) {
	db := database.DB

	var stream streams_entities.Stream

	err := db.Find(&stream, "id = ?", id).Error

	if err != nil {
		return nil, err
	}

	return &stream, nil
}
