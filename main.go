// Copyright (c) 2018 Popcorn
// Author(s) Calvin Feng

package main

import (
	"fmt"
	"github.com/sirupsen/logrus"
	"net/http"
	"os"
	"time"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = ":3000"
	} else {
		port = fmt.Sprintf(":%s", port)
	}

	logrus.SetFormatter(&logrus.TextFormatter{
		FullTimestamp: true,
	})

	db, err := SetupDatabase()

	if err != nil {
		logrus.Error(err)
		return
	}

	defer db.Close()

	server := &http.Server{
		Handler:      LoadRoutes(db),
		Addr:         port,
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}

	logrus.Infof("HTTP server is listening and serving on port %v", port)
	logrus.Fatal(server.ListenAndServe())
}
