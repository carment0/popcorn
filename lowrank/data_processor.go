// Copyright (c) 2018 Popcorn
// Author(s) Calvin Feng

// Package lowrank provides tools to perform low rank approximation on latent features of movies and users.
package lowrank

import "gonum.org/v1/gonum/mat"

type DataProcessor struct {
	UserIDToIndex  map[int]int
	UserIndexToID  map[int]int
	MovieIDToIndex map[int]int
	MovieIndexToID map[int]int
	RatingMap      map[int]map[int]float64
	MovieMap       map[int]*Movie
}

func NewDataProcessor(ratingFilePath string, movieFilepath string) (*DataProcessor, error) {
	var movieMap map[int]*Movie
	var ratingMap map[int]map[int]float64
	var loadErr error

	movieMap, loadErr = loadMovies(movieFilepath)
	if loadErr != nil {
		return nil, loadErr
	}

	ratingMap, loadErr = loadRatingsByUserID(ratingFilePath)
	if loadErr != nil {
		return nil, loadErr
	}

	var i, j int
	userIdToIndex := make(map[int]int)
	userIndexToId := make(map[int]int)
	movieIdToIndex := make(map[int]int)
	movieIndexToId := make(map[int]int)

	// Notice that we could have computed the average rating during loading the data from csv files. However, it would
	// have made the code less readable. I'd rather make the logic clear for this module. The performance gain does not
	// have a huge impact because it is only run once during server starts up.
	i = 0
	for userId := range ratingMap {
		userIdToIndex[userId] = i
		userIndexToId[i] = userId
		i += 1

		for movieId := range ratingMap[userId] {
			movieMap[movieId].Ratings = append(movieMap[movieId].Ratings, ratingMap[userId][movieId])
		}
	}

	// Compute average rating for each movie:
	j = 0
	for movieId := range movieMap {
		movieIdToIndex[movieId] = j
		movieIndexToId[j] = movieId
		j += 1

		movieMap[movieId].AvgRating = Average(movieMap[movieId].Ratings)
	}

	return &DataProcessor{
		UserIDToIndex:  userIdToIndex,
		UserIndexToID:  userIndexToId,
		MovieIDToIndex: movieIdToIndex,
		MovieIndexToID: movieIndexToId,
		RatingMap:      ratingMap,
		MovieMap:       movieMap,
	}, nil
}

// GetRatingMatrix returns a I by J matrix where I represents the ith user and J represents the jth movie. The rating
// matrix was supposed to be sparse but instead of filling it up with zero values. I've decided to set a movie's average
// rating as its baseline. All zero valued spaces will be filled by a movie's average rating.
func (dp *DataProcessor) GetRatingMatrix() *mat.Dense {
	I, J := len(dp.RatingMap), len(dp.MovieMap)
	R := mat.NewDense(I, J, nil)
	for i := 0; i < I; i += 1 {
		for j := 0; j < J; j += 1 {
			userId := dp.UserIndexToID[i]
			movieId := dp.MovieIndexToID[j]
			if _, ok := dp.RatingMap[userId][movieId]; ok {
				R.Set(i, j, dp.RatingMap[userId][movieId])
			} else {
				R.Set(i, j, dp.MovieMap[movieId].AvgRating)
			}
		}
	}

	return R
}
