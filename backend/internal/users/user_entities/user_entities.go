package user_entities

import (
	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

var validate = validator.New()

type User struct {
	ID              uuid.UUID `gorm:"type:uuid;primary_key"`
	Username        string    `gorm:"unique;not null" validate:"required"`
	Avatar          string    `gorm:"not null"`
	GithubAccountId *string
}

func (u *User) BeforeCreate(tx *gorm.DB) error {
	u.ID = uuid.New()
	return nil
}

func (u User) ValidateFields() error {
	err := validate.Struct(u)

	if err != nil {
		return err
	}

	return nil
}
