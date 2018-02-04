package handler

import (
	"github.com/jinzhu/gorm"
	"net/http"
)

func NewUserPreferenceHandler(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Implementation...
	}
}

func NewMovieRecommendationHandler(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Implementation...
	}
}
