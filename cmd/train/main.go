package main

import (
	"fmt"
	"github.com/sirupsen/logrus"
	"popcorn/lowrank"
	"time"
)

func main() {
	logrus.SetFormatter(&logrus.TextFormatter{
		FullTimestamp: true,
	})

	dp, err := lowrank.NewDataProcessor("dataset/ratings.csv", "dataset/movies.csv")
	if err != nil {
		logrus.Fatal(err)
	}

	R := dp.GetRatingMatrix()
	ap := lowrank.NewApproximator(R, 10)
	ap.Train(100, 1, 0, 5e-5)

	predR, _ := ap.ModelPredict()
	I, J := R.Dims()
	for i := 0; i < I; i += 1 {
		for j := 0; j < J; j += 1 {
			fmt.Printf("R: %.2f and Model Prediction: %.2f\n", R.At(i, j), predR.At(i, j))
			time.Sleep(50 * time.Millisecond)
		}
	}
}
