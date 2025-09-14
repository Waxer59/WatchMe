package mux_service

import (
	"fmt"

	"github.com/waxer59/watchMe/internal/streams/streams_entities"
	"github.com/waxer59/watchMe/internal/streams/streams_service"
	"github.com/waxer59/watchMe/internal/users/users_service"
	"github.com/waxer59/watchMe/internal/webhooks/mux/mux_models"
)

func HandleStreamConnected(webhook mux_models.MuxWebhook) error {
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

	err = users_service.UpdateUserById(user.ID.String(), users_service.UpdateUser{
		IsStreaming:               true,
		IsUpdatingStreamingStatus: true,
	})

	if err != nil {
		fmt.Println(err.Error())
		return err
	}

	err = streams_service.CreateStream(&streams_entities.Stream{
		UserId:      user.ID,
		Title:       user.Username,
		PlaybackId:  webhook.Data.PlaybackIds[0].Id,
		IsCompleted: false,
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

	if err != nil {
		fmt.Println(err.Error())
		return err
	}

	err = users_service.UpdateUserById(user.ID.String(), users_service.UpdateUser{
		IsStreaming:               false,
		IsUpdatingStreamingStatus: true,
	})

	if err != nil {
		fmt.Println(err.Error())
		return err
	}

	return nil
}
