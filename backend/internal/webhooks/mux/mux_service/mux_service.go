package mux_service

import (
	"fmt"

	"github.com/google/uuid"
	"github.com/waxer59/watchMe/internal/streamer/streamer_cache"
	"github.com/waxer59/watchMe/internal/streams/streams_entities"
	"github.com/waxer59/watchMe/internal/streams/streams_service"
	"github.com/waxer59/watchMe/internal/users/users_service"
	"github.com/waxer59/watchMe/internal/viewers/viewers_service"
	"github.com/waxer59/watchMe/internal/webhooks/mux/mux_models"
)

func HandleStreamActive(webhook mux_models.MuxWebhook) error {
	streamKeyEntity, err := users_service.FindStreamKeyByKey(webhook.Data.StreamKey)

	if err != nil {
		fmt.Println(err.Error())
		return err
	}

	isStreaming, err := streamer_cache.IsUserStreamingByUserId(streamKeyEntity.UserID.String())

	if err != nil {
		fmt.Println(err.Error())
		return err
	}

	user, err := users_service.GetUserById(streamKeyEntity.UserID.String())

	// Handle duplicate webhooks from Mux
	if isStreaming {
		return nil
	}

	if err != nil {
		fmt.Println(err.Error())
		return err
	}

	streamId := uuid.New()

	err = streams_service.CreateStream(&streams_entities.Stream{
		ID:           streamId,
		UserId:       user.ID,
		Title:        user.DefaultStreamTitle,
		Category:     user.DefaultStreamCategory,
		LiveStreamId: webhook.Object.Id,
		PlaybackId:   webhook.Data.PlaybackIds[0].Id,
	})

	if err != nil {
		fmt.Println(err.Error())
		return err
	}

	err = viewers_service.CreateViewers(streamId.String(), viewers_service.Viewers{
		Count:    0,
		Category: user.DefaultStreamCategory,
	})

	if err != nil {
		fmt.Println(err.Error())
		return err
	}

	err = streamer_cache.SetUserStreamingByUserId(user.ID.String(), streamId.String())

	if err != nil {
		fmt.Println(err.Error())
		return err
	}

	return nil
}

func HandleStreamDisconnected(webhook mux_models.MuxWebhook) error {
	streamKeyEntity, err := users_service.FindStreamKeyByKey(webhook.Data.StreamKey)

	if err != nil {
		fmt.Println(err.Error())
		return err
	}

	user, err := users_service.GetUserById(streamKeyEntity.UserID.String())

	if err != nil {
		fmt.Println(err.Error())
		return err
	}

	isStreaming, err := streamer_cache.IsUserStreamingByUserId(streamKeyEntity.UserID.String())

	// Handle duplicate webhooks from Mux
	if !isStreaming {
		return nil
	}

	if err != nil {
		fmt.Println(err.Error())
		return err
	}

	streamInProgress, err := streams_service.GetLatestNonUploadedStream(user.ID)

	if err != nil {
		fmt.Println(err.Error())
		return err
	}

	if streamInProgress != nil {
		err = streams_service.UpdateStreamById(streamInProgress.ID, streamInProgress)

		if err != nil {
			fmt.Println(err.Error())
			return err
		}
	}

	err = viewers_service.DeleteViewerCount(streamInProgress.ID.String())

	if err != nil {
		fmt.Println(err.Error())
		return err
	}

	err = streamer_cache.DeleteUserStreamingByUserId(user.ID.String())

	if err != nil {
		fmt.Println(err.Error())
		return err
	}

	return nil
}

func HandleAssetLiveStreamCompleted(webhook mux_models.MuxWebhook) error {
	stream, err := streams_service.GetLatestNonUploadedStreamByLiveStreamId(webhook.Data.LiveStreamId)

	if err != nil {
		fmt.Println(err.Error())
		return err
	}

	fmt.Printf("stream: %+v\n", stream)

	if stream.IsUploadDone {
		fmt.Println("stream already uploaded")
		return nil
	}

	stream.PlaybackId = webhook.Data.PlaybackIds[0].Id
	stream.IsUploadDone = true
	stream.AssetId = webhook.Object.Id

	err = streams_service.UpdateStreamById(stream.ID, stream)

	if err != nil {
		fmt.Println(err.Error())
		return err
	}

	return nil
}
