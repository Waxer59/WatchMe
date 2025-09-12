package mux_service

import (
	"github.com/waxer59/watchMe/internal/users/users_service"
)

func HandleStreamConnected(streamKey string) error {
	streamKeyEntity, err := users_service.FindStreamKeyByKey(streamKey)

	if err != nil {
		return err
	}

	user, err := users_service.GetUserById(streamKeyEntity.UserID.String())

	if err != nil {
		return err
	}

	user.IsStreaming = true

	err = users_service.UpdateUserById(user.ID.String(), *user)

	if err != nil {
		return err
	}

	return nil
}

func HandleStreamDisconnected(streamKey string) error {
	streamKeyEntity, err := users_service.FindStreamKeyByKey(streamKey)

	if err != nil {
		return err
	}

	user, err := users_service.GetUserById(streamKeyEntity.UserID.String())

	if err != nil {
		return err
	}

	user.IsStreaming = false

	err = users_service.UpdateUserById(user.ID.String(), *user)

	if err != nil {
		return err
	}
	return nil
}
