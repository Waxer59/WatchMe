package database

import (
	"fmt"
	"log"
	"strconv"

	"github.com/waxer59/watchMe/internal/streams/streams_entities"
	"github.com/waxer59/watchMe/internal/users/user_entities"

	"github.com/waxer59/watchMe/config"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect() {
	p := config.GetEnv("DB_PORT")

	port, err := strconv.ParseUint((p), 10, 16)

	if err != nil {
		log.Fatal(err)
	}

	dsn := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable", config.GetEnv("DB_HOST"), port, config.GetEnv("DB_USERNAME"), config.GetEnv("DB_PASSWORD"), config.GetEnv("DB_NAME"))

	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		panic("Failed to connect to database")
	}

	fmt.Println("Connected to database")

	err = DB.AutoMigrate(
		&user_entities.User{},
		&user_entities.StreamKey{},
		&streams_entities.Stream{},
	)

	if err != nil {
		panic("Failed to migrate database")
	}

	fmt.Println("Migrated database")
}
