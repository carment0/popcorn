// Copyright (c) 2018 Popcorn
// Author(s) Calvin Feng

package main

import (
	"flag"
	"github.com/sirupsen/logrus"
	"gonum.org/v1/gonum/mat"
	"popcorn/lowrank"
)

var isMatrix = flag.Bool("usematrix", true, "indicate whether training should be using matrices")

const InputDir = "datasets/100k/"
const OutputDir = "datasets/100k/"
const FeatureDim = 10

func init() {
	logrus.SetFormatter(&logrus.TextFormatter{
		FullTimestamp: true,
	})
}

func main() {
	flag.Parse()

	if *isMatrix {
		converter, err := lowrank.NewMatrixConverter(InputDir+"ratings.csv", InputDir+"movies.csv")
		if err != nil {
			logrus.Fatal(err)
		}
		fact := lowrank.NewFactorizer(converter, FeatureDim)

		// Start training
		fact.Train(400, 10, 0.03, 1e-5)

		J, _ := fact.MovieLatent.Dims()
		featureMapByMovieID := make(map[int][]float64)
		for j := 0; j < J; j += 1 {
			movieID := converter.MovieIndexToID[j]
			features := make([]float64, FeatureDim)
			mat.Row(features, j, fact.MovieLatent)
			featureMapByMovieID[movieID] = features
		}

		writeFeaturesToCSV(OutputDir+"features.csv", featureMapByMovieID, FeatureDim)
		writePopularityToCSV(OutputDir+"popularity.csv", converter.MovieMap)
		return
	}

	var iterativeFact *lowrank.IterativeFactorizer
	var err error
	var loss, rmse float64

	iterativeFact, err = lowrank.NewIterativeFactorizer(InputDir+"ratings.csv", InputDir+"movies.csv", FeatureDim)
	if err != nil {
		logrus.Fatal(err)
	}

	loss, rmse, err = iterativeFact.Loss(0.03)
	if err != nil {
		logrus.Fatal(err)
	}

	logrus.Warnf("Iterative: loss %.2f and RMSE %.2f", loss, rmse)

	// Perform gradient check on all users
	var discrepancy []float64
	for userID := range iterativeFact.UserLatentMap {
		discrepancy, err = iterativeFact.GradientCheckUserLatent(userID, 0.03, 1e-3)
		logrus.Infof("Gradient check on user %d - %.10f", userID, discrepancy)
	}

	for movieID := range iterativeFact.MovieLatentMap {
		discrepancy, err = iterativeFact.GradientCheckMovieLatent(movieID, 0.03, 1e-3)
		logrus.Infof("Gradient check on movie %d - %.10f", movieID, discrepancy)
	}
}
