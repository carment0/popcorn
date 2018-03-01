// Copyright (c) 2018 Popcorn
// Author(s) Carmen To
package main

import (
	"fmt"
	"popcorn/kmeans"
	"time"
	"math/rand"
)

func main() {
  rand.Seed(time.Now().Unix())

  movies, err := kmeans.ReadFromCSV("datasets/100k/features.csv")
  if err != nil {
    fmt.Println("Failed to read CSV", err)
  } else {
    assignedMovies := kmeans.MovieClustering(movies)
    kmeans.WriteToCSV("datasets/100k/clusters.csv", assignedMovies)
  }
}
