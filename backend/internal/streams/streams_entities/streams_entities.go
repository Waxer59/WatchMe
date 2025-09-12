package streams_entities

type Stream struct {
	Id           string `gorm:"primary_key:not null"`
	UserId       string `gorm:"type:uuid;not null"`
	Title        string `gorm:"not null"`
	Thumbnail    string `gorm:"not null"`
	ThumbnailGif string
	Topic        string
	IsCompleted  bool
	VideoUrl     string
}
