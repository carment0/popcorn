package main

import (
  "encoding/csv"
  "fmt"
  "os"
  "strconv"
  "io"
  "math/rand"
  "math"
  "time"
)

func ReadFromCSV(filepath string) (map[string][]float64, error) {
  var featureMap = make(map[string][]float64)
  csvFile, fileError := os.Open(filepath)

  if fileError != nil {
    return featureMap, fileError
  }

  reader := csv.NewReader(csvFile)
  reader.Read()

  for {
    if row, err := reader.Read(); err != nil {
      if err == io.EOF {
        break
      }
    } else {
      var features []float64
      for i := 1; i <= 2; i += 1 { //<<< changed the feature #
        string := row[i]
        intager, err := strconv.ParseFloat(string, 64)
        if err != nil {
          return featureMap, err
        }
        features = append(features, intager)
      }
      featureMap[row[0]] = features
    }
  }
  return featureMap, nil
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
  featureMap, err := ReadFromCSV("../dataset/features.csv")
  if err != nil {
    fmt.Println("Failed to read CSV", err)
  } else {
    fmt.Println("Done reading")
    center := center(featureMap)
    fmt.Println(center)
    start := time.Now()
    movieIdKeys := movieIdKeys(featureMap)
    centroids := initCentroids(featureMap, movieIdKeys, 1) // <<<<< changed the cluster
    findKMeans(featureMap, centroids)
    elapsed := time.Since(start)
    fmt.Printf("kmeans took %s", elapsed)
  }
}

func center(featureMap map[string][]float64) []float64 {
  var sum []float64
  for _, v := range featureMap {
    if len(sum) == 0 {
      sum = v
    } else {
      sum = sumArray(sum, v)
    }

  }
  sum = divideArray(sum, 15382) // <<<<< change the num
  return sum
}

func findKMeans(featureMap map[string][]float64, centroids map[int][]float64) map[int][]float64 {
  var currentCent = centroids
  var changeCent = true;
  var updatedCent map[int][]float64
  var movieCentAssignment map[int][]string
  var equal bool

  for changeCent == true {
    movieCentAssignment = assigningClosetCent(featureMap, currentCent)
    updatedCent = updateCentWithMean(movieCentAssignment, featureMap, currentCent)
    equal = isEqual(currentCent, updatedCent)
    if equal {
      changeCent = false
    } else {
      currentCent = updatedCent
    }
  }
  fmt.Println(currentCent)
  return currentCent
}

func isEqual(currentCent, updatedCent map[int][]float64) bool {
  for k, v := range currentCent {
    for idx, val := range v {
      if val != updatedCent[k][idx] {
        return false
      }
    }
  }
  return true
}

func updateCentWithMean(movieCentAssignment map[int][]string, featureMap map[string][]float64,  centroids map[int][]float64) map[int][]float64 {
  var updated map[int][]float64
  updated = make(map[int][]float64)

  for k1, v1 := range movieCentAssignment {
    var sum []float64
    if len(v1) == 0 {
      updated[k1] = centroids[k1]
    } else {
      for _, val := range v1 {
        feature := featureMap[val]
        if len(sum) == 0 {
          sum = feature
        } else {
          sum = sumArray(sum, feature)
        }
      }
      length := len(v1)
      meanSum := divideArray(sum, length)
      updated[k1] = meanSum;
    }
  }
  return updated
}

func divideArray(arr []float64, num int) []float64 {
  floatNum := float64(num)
  var array []float64
  for _, val := range arr {
    result := val / floatNum
    array = append(array, result)
  }
  return array
}

func sumArray(prevSum, feature []float64) []float64 {
  var array []float64
  for idx, val := range prevSum {
    result := val + feature[idx]
    array = append(array, result)
  }
  return array
}

func assigningClosetCent(featureMap map[string][]float64, centroids map[int][]float64) map[int][]string {
  var assigned map[int][]string
  var minDist float64
  var centID int
  var arr []string

  assigned = make(map[int][]string)
  for k, _ := range centroids {
    arr := []string{}
    assigned[k] = arr
  }

  for k1, v1 := range featureMap {
    for k2, v2 := range centroids {
      dist := getDistance(v1, v2)
      if minDist == 0 && centID == 0 || minDist > dist {
        minDist = dist
        centID = k2
      }
    }
    if len(assigned[centID]) != 0 {
      arr = assigned[centID]
      arr = append(arr, k1)
      assigned[centID] = arr
    } else {
      arr := []string{k1}
      assigned[centID] = arr
    }
  }
  return assigned
}

func getDistance(movieFeat, centPoint []float64) float64 {
  var dist float64
  for idx, val := range movieFeat {
    x := val - centPoint[idx]
    dist += math.Pow(x, 2)
  }
  return math.Sqrt(dist)
}

func initCentroids(featureMap map[string][]float64, keys []string, centCount int) map[int][]float64 {
  var centroids = make(map[int][]float64)
  for i := 0; i < centCount; i += 1 {
    rand.Seed(int64(time.Now().Nanosecond()))
    idx := rand.Intn(len(featureMap))
    movieId := keys[idx]
    feature := featureMap[movieId]
    centroids[i] = feature
  }
  return centroids
}

func movieIdKeys(featureMap map[string][]float64) []string {
  var keys []string
  for k := range featureMap {
      keys = append(keys, k)
  }
  return keys
}
