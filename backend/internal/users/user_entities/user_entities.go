package user_entities

import (
	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
	"github.com/waxer59/watchMe/internal/streams/streams_entities"
	"gorm.io/gorm"
)

var validate = validator.New()

type User struct {
	ID              uuid.UUID                 `gorm:"type:uuid;primary_key" json:"id"`
	Username        string                    `gorm:"unique;not null" validate:"required" json:"username"`
	Avatar          string                    `gorm:"not null" json:"avatar"`
	GithubAccountId *string                   `json:"github_account_id"`
	StreamKeys      []StreamKey               `json:"stream_keys"`
	Streams         []streams_entities.Stream `json:"streams"`
	IsStreaming     bool                      `gorm:"default:false" json:"is_streaming"`
	Following       []User                    `gorm:"many2many:user_follows;" json:"following"`
	Followers       []User                    `gorm:"many2many:user_follows;" json:"followers"`
}

type StreamKey struct {
	ID     string    `gorm:"primary_key:not null"`
	UserID uuid.UUID `gorm:"type:uuid;"`
	Key    string    `gorm:"unique;not null" validate:"required"`
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
