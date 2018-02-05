package main

import (
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"os"
)

// SetupDatabase will perform database connection and auto migration on all gorm.Models
func SetupDatabase() (*gorm.DB, error) {
	dbCredentials := os.Getenv("DATABASE_URL")

	if dbCredentials == "" {
		dbCredentials = "user=carmento password=carmento dbname=popcorn_development sslmode=disable"
	}

	db, err := gorm.Open("postgres", dbCredentials)
	if err != nil {
		return nil, err
	}

	// db.AutoMigrate()

	return db, nil
}
