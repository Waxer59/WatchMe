package mux_service

import (
	"fmt"

	"github.com/waxer59/watchMe/internal/streams/streams_entities"
	"github.com/waxer59/watchMe/internal/streams/streams_service"
	"github.com/waxer59/watchMe/internal/users/users_service"
	"github.com/waxer59/watchMe/internal/webhooks/mux/mux_models"
)

func HandleStreamActive(webhook mux_models.MuxWebhook) error {
	streamKeyEntity, err := users_service.FindStreamKeyByKey(webhook.Data.StreamKey)

	if err != nil {
		fmt.Println(err.Error())
		return err
	}

	user, err := users_service.GetUserById(streamKeyEntity.UserID.String())

	// Handle duplicate webhooks from Mux
	if user.IsStreaming {
		return nil
	}

	if err != nil {
		fmt.Println(err.Error())
		return err
	}

	err = users_service.UpdateUserById(user.ID, users_service.UpdateUser{
		IsStreaming:               true,
		IsUpdatingStreamingStatus: true,
	})

	if err != nil {
		fmt.Println(err.Error())
		return err
	}

	err = streams_service.CreateStream(&streams_entities.Stream{
		UserId:       user.ID,
		Title:        user.DefaultStreamTitle,
		Category:     user.DefaultStreamCategory,
		LiveStreamId: webhook.Object.Id,
		PlaybackId:   webhook.Data.PlaybackIds[0].Id,
		IsCompleted:  false,
	})

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

	// Handle duplicate webhooks from Mux
	if !user.IsStreaming {
		return nil
	}

	if err != nil {
		fmt.Println(err.Error())
		return err
	}

	err = users_service.UpdateUserById(user.ID, users_service.UpdateUser{
		IsStreaming:               false,
		IsUpdatingStreamingStatus: true,
	})

	if err != nil {
		fmt.Println(err.Error())
		return err
	}

	streamInProgress, err := streams_service.GetStreamInProgressByUserId(user.ID)

	if err != nil {
		fmt.Println(err.Error())
		return err
	}

	if streamInProgress != nil {
		streamInProgress.IsCompleted = true

		err = streams_service.UpdateStreamById(streamInProgress.ID, streamInProgress)

		if err != nil {
			fmt.Println(err.Error())
			return err
		}
	}

	return nil
}

func HandleAssetLiveStreamCompleted(webhook mux_models.MuxWebhook) error {
	stream, err := streams_service.GetNonUploadedStreamByLiveStreamId(webhook.Data.LiveStreamId)

	if err != nil {
		fmt.Println(err.Error())
		return err
	}

	if stream.IsUploadDone {
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
