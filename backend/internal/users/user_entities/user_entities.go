package user_entities

import (
	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
	"github.com/waxer59/watchMe/internal/streams/streams_entities"
	"gorm.io/gorm"
)

var validate = validator.New()

type User struct {
	ID              uuid.UUID                 `gorm:"type:uuid;primary_key" json:"id,omitempty"`
	Username        string                    `gorm:"unique;not null" validate:"required" json:"username,omitempty"`
	Avatar          string                    `gorm:"not null" json:"avatar,omitempty"`
	GithubAccountId *string                   `json:"-"`
	PresenceColor   string                    `gorm:"default:#fff" json:"presence_color,omitempty"`
	StreamKeys      []StreamKey               `json:"stream_keys,omitempty"`
	Streams         []streams_entities.Stream `json:"streams,omitempty"`
	IsStreaming     bool                      `gorm:"default:false" json:"is_streaming,omitempty"`
	Following       []User                    `gorm:"many2many:user_following;" json:"following,omitempty"`
}

type StreamKey struct {
	ID     string    `gorm:"primary_key:not null" json:"id"`
	UserID uuid.UUID `gorm:"type:uuid;" json:"user_id"`
	Key    string    `gorm:"unique;not null" validate:"required" json:"key"`
}

func (u *User) BeforeSave(tx *gorm.DB) error {
	if u.ID == uuid.Nil {
		u.ID = uuid.New()
	}
	return nil
}

func (u User) ValidateFields() error {
	err := validate.Struct(u)

	if err != nil {
		return err
	}

	return nil
}
