package users_service

import (
	"github.com/google/uuid"
	"github.com/waxer59/watchMe/database"
	"github.com/waxer59/watchMe/internal/users/user_entities"
)

func CreateGithubUser(user *user_entities.User) (*user_entities.User, error) {
	db := database.DB

	var existingUser user_entities.User

	err := db.Find(&existingUser, "github_account_id = ?", user.GithubAccountId).Error

	if err != nil {
		return nil, err
	}

	if existingUser.ID != uuid.Nil {
		return &existingUser, nil
	}

	err = db.Create(&user).Error

	if err != nil {
		return nil, err
	}

	return user, nil
}

func GetUserById(id string) (*user_entities.User, error) {
	db := database.DB

	var user user_entities.User

	err := db.Find(&user, "id = ?", id).Error

	if err != nil {
		return nil, err
	}

	return &user, nil
}

func UpdateUserById(id string, user user_entities.User) error {
	db := database.DB

	err := db.Model(&user_entities.User{}).Where("id = ?", id).Updates(map[string]interface{}{
		"username":     user.Username,
		"avatar":       user.Avatar,
		"is_streaming": user.IsStreaming,
	}).Error

	if err != nil {
		return err
	}

	return nil
}

func GetUsersStreaming() ([]user_entities.User, error) {
	db := database.DB

	var users []user_entities.User

	err := db.Find(&users, "is_streaming = ?", true).Error

	if err != nil {
		return nil, err
	}

	return users, nil
}

func CreateStreamKey(keyId string, key string, userId uuid.UUID) (*user_entities.StreamKey, error) {
	db := database.DB

	streamKey := user_entities.StreamKey{
		ID:     keyId,
		Key:    key,
		UserID: userId,
	}

	err := db.Create(&streamKey).Error

	if err != nil {
		return nil, err
	}

	return &streamKey, nil
}

func FindStreamKeyById(id string) (*user_entities.StreamKey, error) {
	db := database.DB

	var streamKey user_entities.StreamKey

	err := db.Find(&streamKey, "id = ?", id).Error

	if err != nil {
		return nil, err
	}

	return &streamKey, nil
}

func FindStreamKeyByKey(key string) (*user_entities.StreamKey, error) {
	db := database.DB

	var streamKey user_entities.StreamKey

	err := db.Find(&streamKey, "key = ?", key).Error

	if err != nil {
		return nil, err
	}

	return &streamKey, nil
}

func DeleteStreamKeyById(id string) error {
	db := database.DB

	err := db.Delete(&user_entities.StreamKey{}, "id = ?", id).Error

	if err != nil {
		return err
	}

	return nil
}

func FindAllStreamKeysByUserId(userId uuid.UUID) ([]user_entities.StreamKey, error) {
	db := database.DB

	var streamKeys []user_entities.StreamKey

	err := db.Find(&streamKeys, "user_id = ?", userId).Error

	if err != nil {
		return nil, err
	}

	return streamKeys, nil
}

func GetUserByUsername(username string) *user_entities.User {
	db := database.DB

	var user user_entities.User

	err := db.Find(&user, "username = ?", username).Error

	if err != nil {
		return nil
	}

	return &user
}
