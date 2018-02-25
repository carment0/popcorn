// Copyright (c) 2018 Popcorn
// Author(s) Calvin Feng

// Package lowrank provides tools to perform low rank factorization on latent features of movies and users.
package lowrank

import (
	"errors"
	"gonum.org/v1/gonum/mat"
	"math"
	"math/rand"
	"time"
)

func RandMat(row, col int) *mat.Dense {
	rand.Seed(time.Now().UTC().Unix())

	randFloats := []float64{}
	for i := 0; i < row*col; i++ {
		randFloats = append(randFloats, rand.Float64())
	}

	return mat.NewDense(row, col, randFloats)
}

func Average(list []float64) float64 {
	sum := 0.0

	if len(list) == 0 {
		return sum
	}

	for _, el := range list {
		sum += el
	}

	return sum / float64(len(list))
}

func AbsMax(M *mat.Dense) float64 {
	I, J := M.Dims()
	max := 0.0
	for i := 0; i < I; i += 1 {
		for j := 0; j < J; j += 1 {
			if math.Abs(M.At(i, j)) > max {
				max = math.Abs(M.At(i, j))
			}
		}
	}

	return max
}

func AbsAverage(M *mat.Dense) float64 {
	I, J := M.Dims()
	sum := 0.0
	for i := 0; i < I; i += 1 {
		for j := 0; j < J; j += 1 {
			sum += math.Abs(M.At(i, j))
		}
	}

	return sum / float64(I*J)
}

func DotProduct(vector1 []float64, vector2 []float64) (float64, error) {
	var sum float64
	if len(vector1) != len(vector2) {
		return sum, errors.New("dimension mismatch")
	}

	for i := 0; i < len(vector1); i += 1 {
		sum += vector1[i] * vector2[i]
	}

	return sum, nil
}

func RandVector(K int) []float64 {
	vector := make([]float64, K)
	for k := 0; k < K; k += 1 {
		vector[k] = rand.Float64()
	}

	return vector
}
