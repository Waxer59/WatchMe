package users_service

import (
	"errors"
	"slices"
	"strings"

	"github.com/google/uuid"
	"github.com/waxer59/watchMe/config"
	"github.com/waxer59/watchMe/database"
	"github.com/waxer59/watchMe/internal/streamer/streamer_cache"
	"github.com/waxer59/watchMe/internal/streams/streams_entities"
	"github.com/waxer59/watchMe/internal/users/user_entities"
)

type UpdateUser struct {
	Username              string                          `json:"username"`
	Avatar                string                          `json:"avatar"`
	PresenceColor         string                          `json:"presence_color"`
	DefaultStreamTitle    string                          `json:"default_stream_title"`
	DefaultStreamCategory streams_entities.StreamCategory `json:"default_stream_category"`
}

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

func UpdateUserById(id uuid.UUID, updateUser UpdateUser) error {
	db := database.DB

	if updateUser.Username != "" {
		isUsernameTaken, errr := FindUserByUsername(updateUser.Username)

		if errr != nil {
			return errr
		}

		if isUsernameTaken != nil {
			return errors.New("username already taken")
		}

		realUsernameSize := len(strings.TrimSpace(updateUser.Username))
		isUsernameValid := realUsernameSize >= config.MIN_USERNAME_LENGTH && realUsernameSize <= config.MAX_USERNAME_LENGTH

		if !isUsernameValid {
			return errors.New("username must be between 3 and 20 characters")
		}
	}

	updateFields := map[string]interface{}{}

	if updateUser.Username != "" {
		updateFields["username"] = updateUser.Username
	}

	if updateUser.Avatar != "" {
		updateFields["avatar"] = updateUser.Avatar
	}

	if updateUser.PresenceColor != "" {
		updateFields["presence_color"] = updateUser.PresenceColor
	}

	if updateUser.DefaultStreamTitle != "" {
		updateFields["default_stream_title"] = updateUser.DefaultStreamTitle
	}

	if updateUser.DefaultStreamCategory != "" {

		if !slices.Contains(streams_entities.StreamCategories, updateUser.DefaultStreamCategory) {
			return errors.New("default stream category not found")
		}

		updateFields["default_stream_category"] = updateUser.DefaultStreamCategory
	}

	err := db.Model(&user_entities.User{
		ID: id,
	}).Updates(updateFields).Error

	if err != nil {
		return err
	}

	return nil
}

func GetUsersStreaming() ([]user_entities.User, error) {
	db := database.DB

	var users []user_entities.User

	usersStreamingIds, err := streamer_cache.GetUsersIdsStreaming()

	if err != nil {
		return nil, err
	}

	err = db.Find(&users, "id IN ?", usersStreamingIds).Error

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

func FindUserByUsername(username string) (*user_entities.User, error) {
	db := database.DB

	var user user_entities.User

	err := db.Find(&user, "username = ?", username).Error

	if err != nil || user.ID == uuid.Nil {
		return nil, err
	}

	return &user, nil
}

func FollowUserByUsername(user *user_entities.User, usernameToFollow string) error {
	db := database.DB

	userToFollow, err := FindUserByUsername(usernameToFollow)

	if err != nil {
		return err
	}

	if userToFollow == nil {
		return errors.New("user not found")
	}

	err = db.Model(user).Association("Following").Append([]user_entities.User{*userToFollow})

	if err != nil {
		return err
	}

	return nil
}

func UnfollowUserByUsername(user *user_entities.User, usernameToUnfollow string) error {
	db := database.DB

	userToUnFollow, err := FindUserByUsername(usernameToUnfollow)

	if err != nil {
		return err
	}

	if userToUnFollow == nil {
		return errors.New("user not found")
	}

	err = db.Model(&user).Association("Following").Delete(userToUnFollow)

	if err != nil {
		return err
	}

	return nil
}

func GetFollowersCount(username string) (int64, error) {
	db := database.DB

	user, err := FindUserByUsername(username)

	if err != nil {
		return 0, err
	}

	if user == nil {
		return 0, nil
	}

	var followersCount int64

	db.Raw(`SELECT COUNT(*) FROM user_following WHERE user_following.following_id = ?`, user.ID).Scan(&followersCount)

	return followersCount, nil
}

func FindAllFollowingUsersByUserId(userId uuid.UUID) ([]user_entities.User, error) {
	db := database.DB

	var users []user_entities.User

	err := db.Model(&user_entities.User{
		ID: userId,
	}).Where("user_id = ?", userId).Association("Following").Find(&users)

	if err != nil {
		return nil, err
	}

	return users, nil
}

func FindUsernameSearch(username string) ([]user_entities.User, error) {
	db := database.DB

	var users []user_entities.User

	err := db.Where("LOWER(username) LIKE ?", "%"+strings.ToLower(username)+"%").Find(&users).Error

	if err != nil {
		return nil, err
	}

	return users, nil
}
