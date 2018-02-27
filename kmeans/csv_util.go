package kmeans

import (
  "encoding/csv"
  "os"
  "strconv"
  "io"
)

const NumOfFeat = 2

type Movie struct {
  MovieID string
  Feature []float64
}

func ReadFromCSV(filePath string) ([]*Movie, error) {
  var movies []*Movie

  csvFile, fileError := os.Open(filePath)

  if fileError != nil {
    return movies, fileError
  }

  reader := csv.NewReader(csvFile)
  reader.Read()

  for {
    if row, err := reader.Read(); err != nil {
      if err == io.EOF {
        break
      }
    } else {
      var feature []float64
      for i := 1; i <= NumOfFeat; i += 1 {
        stringFeat := row[i]
        integer, err := strconv.ParseFloat(stringFeat, 64)

        if err != nil {
          return movies, err
        }

        feature = append(feature, integer)
      }

      movies = append(movies, &Movie {
        MovieID: row[0],
        Feature: feature,

      })
    }
  }

  return movies, nil
}

// func WriteToCSV(filepath string, clustData map[string]int) error {
//   csvFile, fileError := os.Create(filepath)
//   if fileError != nil {
//     return fileError
//   }
//
//   writer := csv.NewWriter(csvFile)
//   header := []string{"movieId", "centGroup"}
//
//   if err := writer.Write(header); err != nil {
//     return err
//   }
//
//   for k, v := range clustData {
//     row := []string{k, strconv.Itoa(v)}
//     writer.Write(row)
//   }
//   writer.Flush()
//   return nil
// }
