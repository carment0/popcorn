// Copyright (c) 2018 Popcorn
// Author(s) Calvin Feng

package model

import "github.com/jinzhu/gorm"

// Since all matrix operations in gonum are done on float64, Postgres should also return a double precision float,
// despite that 64 bit float is an overkill for a rating that only has one decimal precision.
type Movie struct {
	gorm.Model
	Title      string    `gorm:"type:varchar(100)"`
	Year       int       `gorm:"type:integer"`
	IMDBRating float64   `gorm:"type:float8;column:imdb_rating"`
	IMDBID     string    `gorm:"type:varchar(100);column:imdb_id"`
	Feature    []float64 `gorm:"type:float8[]"`
}
