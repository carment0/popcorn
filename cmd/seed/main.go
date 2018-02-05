// Copyright (c) 2018 Popcorn
// Author(s) Calvin Feng

package main

import (
	"fmt"
	"popcorn/model"
)

func main() {
	toyStory := &model.Movie{
		Title: "Toy Story",
	}

	fmt.Println(toyStory)
}
