package main

import (
	"github.com/gorilla/mux"
	"github.com/jinzhu/gorm"
	"net/http"
)

func LoadRoutes(db *gorm.DB) http.Handler {
	// Defining middleware
	logMiddleware := NewServerLoggingMiddleware()

	// Instantiate our router object
	muxRouter := mux.NewRouter().StrictSlash(true)

	// Serve public folder to clients
	muxRouter.PathPrefix("/").Handler(http.FileServer(http.Dir("public")))

	return logMiddleware(muxRouter)
}
