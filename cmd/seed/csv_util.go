package main

import (
	"bufio"
	"encoding/csv"
	"fmt"
	"github.com/lib/pq"
	"io"
	"os"
	"popcorn/model"
	"regexp"
	"strconv"
	"strings"
)

func LoadMovieModelsFromCSVData(filepath string) (map[uint]*model.Movie, error) {
	if csvFile, err := os.Open(filepath); err == nil {
		reader := csv.NewReader(bufio.NewReader(csvFile))

		yearPattern, _ := regexp.Compile("\\(\\d{4}\\)")
		numericPattern, _ := regexp.Compile("\\d{4}")

		movieById := make(map[uint]*model.Movie)
		for {
			if row, readerErr := reader.Read(); readerErr != nil {
				if readerErr == io.EOF {
					break
				} else {
					fmt.Printf("Unexpected reader error: %v", readerErr)
				}
			} else {
				var id, year int64
				var parseErr error

				// bitSize defines range of values. If the value corresponding to s cannot be represented by a signed
				// integer of the given size, err.Err = ErrRange.
				id, parseErr = strconv.ParseInt(row[0], 10, 64)
				if parseErr != nil {
					continue
				}

				yearStr := yearPattern.FindString(row[1])
				trimmedTitle := strings.Trim(row[1], fmt.Sprintf(" %s", yearStr))
				year, parseErr = strconv.ParseInt(numericPattern.FindString(yearStr), 10, 64)
				if parseErr != nil {
					continue
				}

				movieById[uint(id)] = &model.Movie{
					ID:      uint(id),
					Year:    uint(year),
					Title:   trimmedTitle,
					Feature: pq.Float64Array{},
				}
			}
		}

		return movieById, nil
	} else {
		return nil, err
	}
}
