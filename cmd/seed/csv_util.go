package main

import (
	"bufio"
	"encoding/csv"
	"fmt"
	"io"
	"os"
	"popcorn/model"
	"strconv"
)

func LoadMovies(filepath string) (map[uint]*model.Movie, error) {
	if csvFile, err := os.Open(filepath); err == nil {
		reader := csv.NewReader(bufio.NewReader(csvFile))

		movieById := make(map[uint]*model.Movie)
		for {
			if row, readerErr := reader.Read(); readerErr != nil {
				if readerErr == io.EOF {
					break
				} else {
					fmt.Printf("Unexpected reader error: %v", readerErr)
				}
			} else {
				// bitSize defines range of values. If the value corresponding to s cannot be represented by a signed
				// integer of the given size, err.Err = ErrRange.
				id, parseErr := strconv.ParseInt(row[0], 10, 64)
				if parseErr == nil {
					movieById[uint(id)] = &model.Movie{
						ID:    uint(id),
						Title: row[1],
					}
				}
			}
		}

		return movieById, nil
	} else {
		return nil, err
	}
}
