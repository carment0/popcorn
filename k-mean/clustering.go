package main

import (
  "encoding/csv"
  "fmt"
  "os"
  // "strconv"
  "io"
)

func ReadFromCSV(filepath string) error {
  csvFile, fileError := os.Open(filepath)
  if fileError != nil {
    return fileError
  }

  reader := csv.NewReader(csvFile)
  reader.Read()
  for {
    if row, err := reader.Read(); err != nil {
      if err == io.EOF {
        break
      // } else {
      //   // do something here
      }
    }
  }
  return nil
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

func main() {
  if err := ReadFromCSV("../dataset/features.csv"); err != nil {
    fmt.Println("Failed to read CSV")
  } else {
    fmt.Println("Done reading")
  }
}
