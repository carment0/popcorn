// Copyright (c) 2018 Popcorn
// Author(s) Calvin Feng

package main

import (
	"encoding/csv"
	"fmt"
	"github.com/sirupsen/logrus"
	"gonum.org/v1/gonum/mat"
	"os"
	"popcorn/lowrank"
	"strconv"
)

func WriteToCSV(filepath string, movieFeatures map[int][]float64, featureDim int) error {
	csvFile, fileErr := os.Create(filepath)
	if fileErr != nil {
		return fileErr
	}

	writer := csv.NewWriter(csvFile)
	defer writer.Flush()

	header := []string{"movieId"}
	for i := 1; i <= featureDim; i += 1 {
		header = append(header, fmt.Sprintf("f%v", i))
	}

	var writerError error

	// Write the header first
	writerError = writer.Write(header)
	if writerError != nil {
		return writerError
	}

	for movieID, features := range movieFeatures {
		row := []string{strconv.Itoa(movieID)}

		for _, feature := range features {
			row = append(row, strconv.FormatFloat(feature, 'f', 6, 64))
		}

		writerError = writer.Write(row)
		if writerError != nil {
			logrus.Errorf("Failed to write row: %s\n", row)
		}
	}

	return nil
}

func main() {
	logrus.SetFormatter(&logrus.TextFormatter{
		FullTimestamp: true,
	})

	processor, err := lowrank.NewDataProcessor("megaset/ratings.csv", "megaset/movies.csv")
	if err != nil {
		logrus.Fatal(err)
	}

	featureDim := 10
	R := processor.GetRatingMatrix()
	approx := lowrank.NewApproximator(R, featureDim)
	approx.DataProcessor = processor

	// Start training
	approx.Train(100, 5, 0, 4e-6)

	J, _ := approx.MovieLatent.Dims()
	featureMapByMovieID := make(map[int][]float64)
	for j := 0; j < J; j += 1 {
		movieID := processor.MovieIndexToID[j]
		features := make([]float64, featureDim)
		mat.Row(features, j, approx.MovieLatent)
		featureMapByMovieID[movieID] = features
	}

	WriteToCSV("megaset/features.csv", featureMapByMovieID, featureDim)
}
