// Copyright (c) 2018 Popcorn
// Author(s) Calvin Feng

package handler

import (
	"github.com/jinzhu/gorm"
	"net/http"
)

func NewMovieListHandler(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Implementation...
	}
}

func NewMovieMostViewedHandler(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Implementation...
	}
}
