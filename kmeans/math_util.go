// Copyright (c) 2018 Popcorn
// Author(s) Carmen To
package kmeans

func Divide(sum[]float64, num int) []float64 {
  floatNum := float64(num)
  var array []float64
  for _, val := range sum {
    result := val / floatNum
    array = append(array, result)
  }
  return array
}

func Sum(sum, feature []float64) []float64 {
  var array []float64
  for idx, val := range sum {
    result := val + feature[idx]
    array = append(array, result)
  }
  return array
}
