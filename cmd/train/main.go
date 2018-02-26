// Copyright (c) 2018 Popcorn
// Author(s) Calvin Feng

package main

import (
	"flag"
	"github.com/sirupsen/logrus"
	"gonum.org/v1/gonum/mat"
	"popcorn/lowrank"
	"time"
)

var isVectorized = flag.Bool(
	"vectorized",
	true,
	"indicate whether training should be vectorized, i.e. using matrices",
)

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

	if *isVectorized {
		converter, err := lowrank.NewMatrixConverter(InputDir+"ratings.csv", InputDir+"movies.csv")
		if err != nil {
			logrus.Fatal(err)
		}
		fact := lowrank.NewFactorizer(converter, FeatureDim)

		startTime := time.Now()

		// Start training
		fact.Train(400, 10, 0.03, 1e-5)

		endTime := time.Now()

		logrus.Infof("Training took %s seconds", endTime.Sub(startTime))

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
	} else {
		var iterativeFact *lowrank.IterativeFactorizer
		var err error

		iterativeFact, err = lowrank.NewIterativeFactorizer(InputDir+"ratings.csv", InputDir+"movies.csv", FeatureDim)
		if err != nil {
			logrus.Fatal(err)
		}

		startTime := time.Now()

		iterativeFact.Train(400, 10, 0.03, 1e-5)

		endTime := time.Now()

		logrus.Infof("Training took %s seconds", endTime.Sub(startTime))
	}
}
