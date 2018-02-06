// Copyright (c) 2018 Popcorn
// Author(s) Calvin Feng

package model

import (
	"github.com/lib/pq"
	"time"
)

// Since all matrix operations in gonum are done on float64, Postgres should also return a double precision float,
// despite that 64 bit float is an overkill for a rating that only has one decimal precision.
type Movie struct {
	// Model base class attributes
	ID        uint `gorm:"primary_key"`
	CreatedAt time.Time
	UpdatedAt time.Time

	// Movie base attributes
	Title      string  `gorm:"type:varchar(500);index"`
	Year       uint    `gorm:"type:integer;index"`
	IMDBID     string  `gorm:"type:varchar(100);column:imdb_id"`
	TMDBID     string  `gorm:"type:varchar(100);column:tmdb_id"`
	IMDBRating float64 `gorm:"type:float8;column:imdb_rating"`

	// NumRating is the number of ratings of this movie received from MovieLens dataset, while average rating is the
	// average of all the ratings received from MovieLens users.
	NumRating     int             `gorm:"type:integer"`
	AverageRating float64         `gorm:"type:float8"`
	Feature       pq.Float64Array `gorm:"type:float8[]"`
}
