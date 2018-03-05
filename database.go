// Copyright (c) 2018 Popcorn
// Author(s) Calvin Feng

package main

import (
	"fmt"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"github.com/sirupsen/logrus"
	"os"
	"popcorn/model"
)

const (
	LocalDBUser     = "popcorn"
	LocalDBPassword = "popcorn"
	LocalDBName     = "popcorn_development"
	LocalSSLMode    = "disable"
)

// SetupDatabase will perform database connection and auto migration on all gorm.Models
func SetupDatabase() (*gorm.DB, error) {
	dbCredentials := os.Getenv("DATABASE_URL")

	if dbCredentials == "" {
		logrus.WithField("src", "database").Warn("database credentials is not found in env")
		dbCredentials = fmt.Sprintf("user=%s password=%s dbname=%s sslmode=%s",
			LocalDBUser, LocalDBPassword, LocalDBName, LocalSSLMode,
		)
	} else {
		logrus.WithField("src", "database").Infof("connecting to Postgres using %s", dbCredentials)
	}

	db, err := gorm.Open("postgres", dbCredentials)
	if err != nil {
		return nil, err
	}

	db.AutoMigrate(&model.Movie{}, &model.MovieDetail{}, &model.MovieTrailer{}, &model.User{}, &model.Rating{})

	return db, nil
}
