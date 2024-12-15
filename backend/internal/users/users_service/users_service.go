package users_service

import (
	"github.com/google/uuid"
	"github.com/waxer59/watchMe/database"
	"github.com/waxer59/watchMe/internal/users/user_entities"
)

type UpdateUser struct {
	Username string
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
