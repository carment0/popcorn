// Copyright (c) 2018 Popcorn
// Author(s) Calvin Feng

package main

import (
	"fmt"
)

func main() {
	if models, err := LoadMovies("dataset/movies.csv"); err != nil {
		fmt.Println("Fatal", err)
	} else {
		fmt.Println(len(models))
	}
}
