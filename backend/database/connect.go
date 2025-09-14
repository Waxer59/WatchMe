package database

import (
	"fmt"
	"log"
	"os"
	"strconv"

	"github.com/waxer59/watchMe/internal/streams/streams_entities"
	"github.com/waxer59/watchMe/internal/users/user_entities"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect() {
	p := os.Getenv("DB_PORT")

	port, err := strconv.ParseUint((p), 10, 16)

	if err != nil {
		log.Fatal(err)
	}

	isProduction := os.Getenv("ENVIRONMENT") == "PROD"
	sslMode := "disable"

	if isProduction {
		sslMode = "require"
	}

	dsn := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=%s", os.Getenv("DB_HOST"), port, os.Getenv("DB_USERNAME"), os.Getenv("DB_PASSWORD"), os.Getenv("DB_NAME"), sslMode)

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
