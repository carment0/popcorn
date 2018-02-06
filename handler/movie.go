// Copyright (c) 2018 Popcorn
// Author(s) Calvin Feng

package handler

import (
	"encoding/json"
	"github.com/jinzhu/gorm"
	"net/http"
	"popcorn/model"
)

type MovieJSONResponse struct {
	Title string `json:"title"`
	Year int `json:"year"`
}

func NewMovieListHandler(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var movies []model.Movie
		if err := db.Order("year desc").Find(&movies).Error; err != nil {
			RenderError(w, err.Error(), http.StatusInternalServerError)
			return
		}

		res := []*MovieJSONResponse{}
		for _, movie := range movies {
			res = append(res, &MovieJSONResponse{
				Title:       movie.Title,
				Year:        movie.Year,
			})
		}
		if bytes, err := json.Marshal(res); err != nil {
			RenderError(w, err.Error(), http.StatusInternalServerError)
		} else {
			w.WriteHeader(http.StatusOK)
			w.Write(bytes)
		}
	}
}

func NewMovieMostViewedHandler(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Implementation...
	}
}
