package streams_entities

import (
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

var validate = validator.New()

type Stream struct {
	ID           uuid.UUID `gorm:"primary_key:not null" json:"id,omitempty"`
	UserId       uuid.UUID `gorm:"not null" json:"user_id,omitempty"`
	Title        string    `gorm:"not null" json:"title,omitempty"`
	LiveStreamId string    `gorm:"not null" json:"-"`
	PlaybackId   string    `gorm:"not null" json:"playback_id,omitempty"`
	Category     string    `json:"category,omitempty"`
	Viewers      int       `json:"viewers,omitempty"`
	AssetId      string    `json:"-"`
	IsCompleted  bool      `json:"is_completed,omitempty"`
	IsUploadDone bool      `json:"-" default:"false"`
	CreatedAt    time.Time `json:"-" gorm:"default:CURRENT_TIMESTAMP"`
}

func (u *Stream) BeforeSave(tx *gorm.DB) error {
	if u.ID == uuid.Nil {
		u.ID = uuid.New()
	}
	return nil
}

func (u Stream) ValidateFields() error {
	err := validate.Struct(u)

	if err != nil {
		return err
	}

	return nil
}
