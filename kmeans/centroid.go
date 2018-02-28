// Copyright (c) 2018 Popcorn
// Author(s) Carmen To
package kmeans

import (
  "math/rand"
  "time"
)

type Centroid struct {
  ClusterID int
  Position []float64
}

func InitCentroids(movies []*Movie, centCount int) []*Centroid {
  centroids := make([]*Centroid, 0, centCount)

  for i := 0; i < centCount; i += 1 {
    rand.Seed(int64(time.Now().Nanosecond()))
    idx := rand.Intn(len(movies))

    feature := movies[idx].Feature
    position := make([]float64, len(feature))
    copy(position, feature)

    centroids = append(centroids, &Centroid{
      ClusterID: i,
      Position: position,
    })
  }

  return centroids
}
