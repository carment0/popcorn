// Copyright (c) 2018 Popcorn
// Author(s) Calvin Feng

package handler

import (
	"github.com/jinzhu/gorm"
	"net/http"
)

func NewUserCreateHandler(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Implementation...
	}
}

func NewUserListHandler(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Implementation...
	}
}
