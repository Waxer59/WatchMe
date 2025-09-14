package streams_entities

import (
	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

var validate = validator.New()

type Stream struct {
	ID          uuid.UUID `gorm:"primary_key:not null" json:"id"`
	UserId      uuid.UUID `gorm:"not null" json:"user_id"`
	Title       string    `gorm:"not null" json:"title"`
	PlaybackId  string    `gorm:"not null" json:"playback_id"`
	Topic       string    `json:"topic"`
	IsCompleted bool      `json:"is_completed"`
}

func (u *Stream) BeforeCreate(tx *gorm.DB) error {
	u.ID = uuid.New()
	return nil
}

func (u Stream) ValidateFields() error {
	err := validate.Struct(u)

	if err != nil {
		return err
	}

	return nil
}
