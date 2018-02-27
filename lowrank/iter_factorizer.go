// Copyright (c) 2018 Popcorn
// Author(s) Calvin Feng

// Package lowrank provides tools to perform low rank factorization on latent features of movies and users.
package lowrank

import (
	"fmt"
	"github.com/sirupsen/logrus"
	"math"
	"math/rand"
)

func NewIterativeFactorizer(ratingFilePath, movieFilePath string, K int) (*IterativeFactorizer, error) {
	var movieMap map[int]*Movie
	var trainingUserMovieRatingMap, trainingMovieUserRatingMap, trainSet, testSet map[int]map[int]float64
	var loadErr error

	movieMap, loadErr = loadMovies(movieFilePath)
	if loadErr != nil {
		return nil, loadErr
	}

	trainSet, loadErr = loadUserRatings(ratingFilePath)
	if loadErr != nil {
		return nil, loadErr
	}

	// Create counter to know how many test samples and training samples we have
	testSetCount, trainSetCount := 0, 0
	trainingUserMovieRatingMap = make(map[int]map[int]float64)
	trainingMovieUserRatingMap = make(map[int]map[int]float64)
	testSet = make(map[int]map[int]float64)

	// Randomly assign each user and movie a latent vector
	userLatentMap := make(map[int][]float64)
	movieLatentMap := make(map[int][]float64)

	for userID := range trainSet {
		userLatentMap[userID] = RandVector(K)
		for movieID := range trainSet[userID] {
			movieLatentMap[movieID] = RandVector(K)

			if trainingUserMovieRatingMap[userID] == nil {
				trainingUserMovieRatingMap[userID] = make(map[int]float64)
			}

			if trainingMovieUserRatingMap[movieID] == nil {
				trainingMovieUserRatingMap[movieID] = make(map[int]float64)
			}

			if testSet[userID] == nil {
				testSet[userID] = make(map[int]float64)
			}

			if rand.Float64() < TEST_RATIO {
				testSetCount += 1
				testSet[userID][movieID] = trainSet[userID][movieID]
			} else {
				trainSetCount += 1
				trainingUserMovieRatingMap[userID][movieID] = trainSet[userID][movieID]
				trainingMovieUserRatingMap[movieID][userID] = trainSet[userID][movieID]
				movieMap[movieID].Ratings = append(movieMap[movieID].Ratings, trainSet[userID][movieID])
			}
		}
	}

	for movieID := range movieMap {
		movieMap[movieID].AvgRating = Average(movieMap[movieID].Ratings)
	}

	fmtString := "CSV data are loaded with %d training samples and %d test samples from %d users on %d movies"
	logMessage := fmt.Sprintf(
		fmtString, trainSetCount, testSetCount, len(trainingUserMovieRatingMap), len(trainingMovieUserRatingMap))
	logrus.WithField("file", "lowrank.iterative_factorizer").Infof(logMessage)

	return &IterativeFactorizer{
		MovieMap:                   movieMap,
		UserLatentMap:              userLatentMap,
		MovieLatentMap:             movieLatentMap,
		TrainingUserMovieRatingMap: trainingUserMovieRatingMap,
		TrainingMovieUserRatingMap: trainingMovieUserRatingMap,
		TestRatingMap:              testSet,
	}, nil
}

// IterativeFactorizer does not use matrices at all. Instead, it holds each user's preference vector and movie's feature
// vector in a map. It does not cache predicted rating; it only computes it when it is needed. Although vectorized
// implementations lead to better time performance, it is extremely space hungry. For 20,000 users and 45,000 movies,
// the number of generated predicted rating is 900 millions. Each float64 is 8 bytes, and that is 7.2 billion bytes of
// memory.
type IterativeFactorizer struct {
	MovieMap                   map[int]*Movie
	UserLatentMap              map[int][]float64
	MovieLatentMap             map[int][]float64
	TrainingUserMovieRatingMap map[int]map[int]float64
	TrainingMovieUserRatingMap map[int]map[int]float64
	TestRatingMap              map[int]map[int]float64
}

func (f *IterativeFactorizer) Train(steps int, epochSize int, reg float64, learnRate float64) {
	for step := 0; step < steps; step += 1 {
		var err error

		if step%epochSize == 0 {
			loss, rootMeanSqError, _ := f.Loss(reg)
			logMessage := fmt.Sprintf(`iteration %3d: net loss %5.2f and RMSE %1.8f`, step, loss, rootMeanSqError)
			logrus.WithField("file", "lowrank.iterative_factorizer").Info(logMessage)
		}

		userGradMap := make(map[int][]float64)

		// Compute gradients first, and then update
		for userID := range f.UserLatentMap {
			userGradMap[userID], err = f.GradientUserLatent(userID, reg)
			if err != nil {
				panic(err)
			}
		}

		movieGradMap := make(map[int][]float64)

		// Same here, always get all the gradients first before modifying the latent values
		for movieID := range f.MovieLatentMap {
			movieGradMap[movieID], err = f.GradientMovieLatent(movieID, reg)
			if err != nil {
				panic(err)
			}
		}

		// Perform update
		for userID := range f.UserLatentMap {
			for k := 0; k < len(f.UserLatentMap[userID]); k += 1 {
				f.UserLatentMap[userID][k] -= learnRate * userGradMap[userID][k]
			}
		}

		for movieID := range f.MovieLatentMap {
			for k := 0; k < len(f.MovieLatentMap[movieID]); k += 1 {
				f.MovieLatentMap[movieID][k] -= learnRate * movieGradMap[movieID][k]
			}
		}
	}
}

func (f *IterativeFactorizer) Loss(reg float64) (float64, float64, error) {
	var loss float64
	for userID := range f.TrainingUserMovieRatingMap {
		userLatent := f.UserLatentMap[userID]
		for movieID := range f.TrainingUserMovieRatingMap[userID] {
			movieLatent := f.MovieLatentMap[movieID]
			predictedRating, err := DotProduct(userLatent, movieLatent)
			if err != nil {
				return 0, 0, err
			}

			loss += 0.5 * math.Pow(f.TrainingUserMovieRatingMap[userID][movieID]-predictedRating, 2)
		}
	}

	for userID := range f.UserLatentMap {
		for _, latentValue := range f.UserLatentMap[userID] {
			loss += 0.5 * reg * math.Pow(latentValue, 2)
		}
	}

	for movieID := range f.MovieLatentMap {
		for _, latentValue := range f.MovieLatentMap[movieID] {
			loss += 0.5 * reg * math.Pow(latentValue, 2)
		}
	}

	var rootMeanSqError, testCount float64
	for userID := range f.TestRatingMap {
		for movieID := range f.TestRatingMap[userID] {
			predictedRating, err := DotProduct(f.UserLatentMap[userID], f.MovieLatentMap[movieID])
			if err != nil {
				return 0, 0, err
			}

			rootMeanSqError += math.Pow(f.TestRatingMap[userID][movieID]-predictedRating, 2)
			testCount += 1
		}
	}
	rootMeanSqError /= testCount
	rootMeanSqError = math.Sqrt(rootMeanSqError)

	return loss, rootMeanSqError, nil
}

// TODO: Use stochastic gradient descent
func (f *IterativeFactorizer) GradientUserLatent(userID int, reg float64) ([]float64, error) {
	userLatent := f.UserLatentMap[userID]
	gradUserLatent := make([]float64, 0, len(userLatent))
	for k := 0; k < len(userLatent); k += 1 {
		gradK := 0.0
		for movieID := range f.TrainingUserMovieRatingMap[userID] {
			predictedRating, err := DotProduct(f.UserLatentMap[userID], f.MovieLatentMap[movieID])
			if err != nil {
				return nil, err
			}

			gradK += -1.0 * (f.TrainingUserMovieRatingMap[userID][movieID] - predictedRating) * f.MovieLatentMap[movieID][k]
		}

		gradK += reg * userLatent[k]
		gradUserLatent = append(gradUserLatent, gradK)
	}

	return gradUserLatent, nil
}

// TODO: Use stochastic gradient descent
func (f *IterativeFactorizer) GradientMovieLatent(movieID int, reg float64) ([]float64, error) {
	movieLatent := f.MovieLatentMap[movieID]
	gradMovieLatent := make([]float64, 0, len(movieLatent))
	for k := 0; k < len(movieLatent); k += 1 {
		gradK := 0.0
		for userID := range f.TrainingMovieUserRatingMap[movieID] {
			predictedRating, err := DotProduct(f.UserLatentMap[userID], f.MovieLatentMap[movieID])
			if err != nil {
				return nil, err
			}

			gradK += -1.0 * (f.TrainingMovieUserRatingMap[movieID][userID] - predictedRating) * f.UserLatentMap[userID][k]
		}

		gradK += reg * movieLatent[k]
		gradMovieLatent = append(gradMovieLatent, gradK)
	}

	return gradMovieLatent, nil
}

// Gradient check returns the discrepancy of analytical gradient and numerical gradient for a given user's latent
// preference vector.
func (f *IterativeFactorizer) GradientCheckUserLatent(userID int, reg float64, h float64) ([]float64, error) {
	var err error
	var fxph, fxmh float64
	var analyticalGrad, numericalGrad, discrepancy []float64

	analyticalGrad, err = f.GradientUserLatent(userID, reg)
	numericalGrad = make([]float64, len(analyticalGrad))

	for k := 0; k < len(analyticalGrad); k += 1 {
		oldVal := f.UserLatentMap[userID][k]

		// Compute f(x + h)
		f.UserLatentMap[userID][k] = oldVal + h
		fxph, _, err = f.Loss(reg)
		if err != nil {
			return nil, err
		}

		// Compute f(x -h)
		f.UserLatentMap[userID][k] = oldVal - h
		fxmh, _, err = f.Loss(reg)
		if err != nil {
			return nil, err
		}

		// Reset value
		f.UserLatentMap[userID][k] = oldVal

		// Compute numerical slope
		numericalGrad[k] = (fxph - fxmh) / (2 * h)
	}

	discrepancy = make([]float64, len(analyticalGrad))

	for k := 0; k < len(analyticalGrad); k += 1 {
		discrepancy[k] = numericalGrad[k] - analyticalGrad[k]
	}

	return discrepancy, nil
}

// Gradient check returns the discrepancy of analytical gradient and numerical gradient for a given movie's latent
// feature vector.
func (f *IterativeFactorizer) GradientCheckMovieLatent(movieID int, reg float64, h float64) ([]float64, error) {
	var err error
	var fxph, fxmh float64
	var analyticalGrad, numericalGrad, discrepancy []float64

	analyticalGrad, err = f.GradientMovieLatent(movieID, reg)
	numericalGrad = make([]float64, len(analyticalGrad))

	for k := 0; k < len(analyticalGrad); k += 1 {
		oldVal := f.MovieLatentMap[movieID][k]

		// Compute f(x + h)
		f.MovieLatentMap[movieID][k] = oldVal + h
		fxph, _, err = f.Loss(reg)
		if err != nil {
			return nil, err
		}

		// Compute f(x -h)
		f.MovieLatentMap[movieID][k] = oldVal - h
		fxmh, _, err = f.Loss(reg)
		if err != nil {
			return nil, err
		}

		// Reset value
		f.MovieLatentMap[movieID][k] = oldVal

		// Compute numerical slope
		numericalGrad[k] = (fxph - fxmh) / (2 * h)
	}

	discrepancy = make([]float64, len(analyticalGrad))

	for k := 0; k < len(analyticalGrad); k += 1 {
		discrepancy[k] = numericalGrad[k] - analyticalGrad[k]
	}

	return discrepancy, nil
}
