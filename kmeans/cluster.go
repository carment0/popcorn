// Copyright (c) 2018 Popcorn
// Author(s) Carmen To
package kmeans

import (
  "math"
)

const centCount = 1000

type MovieAssignments struct {
  Movie *Movie
  Centroid *Centroid
}

func MovieClustering(movies []*Movie) []*MovieAssignments {
  assignedMovies := make([]*MovieAssignments, 0, len(movies))
  clustering := kMeans(movies)
  for _, cluster := range clustering {
    for _, movie := range cluster.MovieList {
      assignedMovies = append(assignedMovies, &MovieAssignments{
        Movie: movie,
        Centroid: cluster.Centroid,
      })
    }
  }

  return assignedMovies
}

type Cluster struct {
  Centroid *Centroid
  MovieList []*Movie
}

func kMeans(movies []*Movie) []*Cluster {
  centroids := InitCentroids(movies, centCount)
  currentCluster := assignMoviesToCentroids(movies, centroids)

  for {
    if updatedCluster, changed := updateMovieToCentroids(currentCluster); changed == false {
      return updatedCluster
    } else {
      currentCluster = updatedCluster
    }
  }
}

func assignMoviesToCentroids(movies []*Movie, centroids []*Centroid) []*Cluster {
  cluster := make([]*Cluster, 0, len(centroids))
  assignment := make(map[*Centroid][]*Movie)

  for _, centroid := range centroids {
    arr := []*Movie{}
    assignment[centroid] = arr
  }

  for _, movie := range movies {
    var minDist float64
    var centIdx int
    for idx2, centroid := range centroids {
      dist := distance(movie.Feature, centroid.Position)
      if minDist == 0 && centIdx == 0 || minDist > dist {
        minDist = dist
        centIdx = idx2
      }
    }
    cent := centroids[centIdx]
    movieArr := assignment[cent]
    movieArr = append(movieArr, movie)
    assignment[cent] = movieArr
  }

  for centroidKey, moviesValue := range assignment {
    cluster = append(cluster, &Cluster{
      Centroid: centroidKey,
      MovieList: moviesValue,
    })
  }
  return cluster
}

func updateMovieToCentroids(clusters []*Cluster) ([]*Cluster, bool) {
  equalCent := true
  for _, centGroup := range clusters {
    centPosition := centGroup.Centroid.Position
    var sum = make([]float64, 0, len(centPosition))
    for _, movie := range centGroup.MovieList {
      if len(sum) == 0 {
        sum = movie.Feature
      } else {
        sum = Sum(sum, movie.Feature)
      }
    }
    length := len(centGroup.MovieList)
    meanSum := Divide(sum, length)
    if equalCent == true && isEqual(meanSum, centPosition) == false {
      centPosition = meanSum
      equalCent = false
    }
  }
  return clusters, equalCent
}

func distance(movieFeat, centroidPos []float64) float64 {
  var dist float64
  for idx, val := range movieFeat {
    diff := val - centroidPos[idx]
    dist += math.Pow(diff, 2)
  }
  return math.Sqrt(dist)
}

func isEqual(meanSum, centPosition []float64) bool {
  for idx, val := range meanSum {
    if intConversion(val) != intConversion(centPosition[idx]) {
      return false
    }
  }
  return true
}

func intConversion(floatNum float64) int {
  return int(floatNum * 1000)
}
