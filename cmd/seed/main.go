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

func main() {
	logrus.SetFormatter(&logrus.TextFormatter{
		FullTimestamp: true,
	})

	dbCredentials := os.Getenv("DATABASE_URL")

	if dbCredentials == "" {
		dbCredentials = fmt.Sprintf("user=%s password=%s dbname=%s sslmode=%s",
			LocalDBUser, LocalDBPassword, LocalDBName, LocalSSLMode,
		)
	}

	db, err := gorm.Open("postgres", dbCredentials)
	if err != nil {
		logrus.Fatal("Cannot connect to database for seeding:", err)
	} else {
		logrus.Infof("Connected to database with the following credentials: %s", dbCredentials)
	}

	var movieModelsMap map[uint]*model.Movie
	var movieRatingsMap map[uint][]float64
	var metadataMap map[uint]map[string]string
	var loadError error

	movieModelsMap, loadError = LoadMoviesCSVFile("dataset/movies.csv")
	if loadError != nil {
		logrus.Fatal("Failed to load movie models from CSV data:", loadError)
		return
	}

	movieRatingsMap, loadError = LoadRatingsCSVFile("dataset/ratings.csv")
	if loadError != nil {
		logrus.Fatal("Failed to load movie ratings from CSV data:", loadError)
		return
	}

	metadataMap, loadError = LoadMetadataCSVFile("dataset/links.csv")
	if loadError != nil {
		logrus.Fatal("Failed to load movie metadata from CSV data:", loadError)
		return
	}

	logrus.Info("Movie and rating data are loaded from csv files")

	if db.HasTable(&model.Movie{}) {
		db.DropTable(&model.Movie{})
		logrus.Info("Existing table is dropped: movies")
	}

	db.CreateTable(&model.Movie{})
	logrus.Info("New table is created: movies")

	count := 0
	for movieId := range movieModelsMap {
		movie := movieModelsMap[movieId]

		if ratingList, ok := movieRatingsMap[movieId]; ok {
			movie.AverageRating = Average(ratingList)
			movie.NumRating = len(ratingList)
		}

		if dict, ok := metadataMap[movieId]; ok {
			movie.IMDBID = dict["imdb"]
			movie.TMDBID = dict["tmdb"]
		}

		if db.Create(movie).Error == nil {
			count += 1
		}
	}

	logrus.Infof("Completed seeding %d movies", count)

}
