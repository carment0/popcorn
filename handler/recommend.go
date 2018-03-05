// Copyright (c) 2018 Popcorn
// Author(s) Calvin Feng, Carmen To

package handler

import (
	"encoding/json"
	"github.com/gorilla/mux"
	"github.com/jinzhu/gorm"
	"gonum.org/v1/gonum/mat"
	"math/rand"
	"net/http"
	"popcorn/model"
	"time"
	"strconv"
	"sort"
)

type RecommendRequestPayload struct {
	MaxYear    uint   						`json:"max"`
	MinYear    uint   						`json:"min"`
	Percentile uint   						`json:"percent"`
	Skipped    []uint 						`json:"skipped"`
	Ratings 	 map[uint]float64		`json:"ratings"`
}

type ClusterCount struct {
	ClusterID string
	Count 		int
}

func NewMovieRecommendationHandler(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		decoder := json.NewDecoder(r.Body)

		var payload RecommendRequestPayload
		if err := decoder.Decode(&payload); err != nil {
			RenderError(w, "Failed to parse request JSON into struct", http.StatusInternalServerError)
			return
		}

		var maxYear uint = 2018
		var minYear uint = 1930
		if payload.MaxYear != 0 {
			maxYear = payload.MaxYear
		}

		if payload.MinYear != 0 {
			minYear = payload.MinYear
		}

		movieRatings := map[uint]string{}
		ratedMovieIDs := []uint{}
		for movieID, rating := range payload.Ratings {
			ratedMovieIDs = append(ratedMovieIDs, movieID)
			if rating < 2.5 {
				movieRatings[movieID] = "low"
			} else if rating > 3.5 {
				movieRatings[movieID] = "high"
			} else {
				movieRatings[movieID] = "mid"
			}
		}

		skipped := map[uint]bool{}
		for _, movieID := range payload.Skipped {
			skipped[movieID] = true
		}

		var movieCount int
		if err := db.Model(&model.Movie{}).Count(&movieCount).Error; err != nil {
			RenderError(w, err.Error(), http.StatusInternalServerError)
			return
		}

		var percentage float64
		switch payload.Percentile {
		case 100:
			percentage = 0.01
		case 80:
			percentage = 0.2
		case 60:
			percentage = 0.4
		case 40:
			percentage = 0.6
		case 20:
			percentage = 0.8
		default:
			percentage = 1.0
		}

		limit := int(float64(movieCount) * percentage)

		var ratedMovies []*model.Movie
		if err := db.Where("id in (?)", ratedMovieIDs).
			Find(&ratedMovies).Error; err != nil {
			RenderError(w, err.Error(), http.StatusInternalServerError)
			return
		}

		lowRatedMovies := []string{}
		highRatedMovies := []string{}

		for _, value := range ratedMovies {
			stringID := strconv.FormatUint(uint64(value.ClusterID), 10)
			switch movieRatings[value.ID] {
			case "high":
				highRatedMovies = append(highRatedMovies, value.NearestClusters...)
				highRatedMovies = append(highRatedMovies, stringID)
			case "low":
				lowRatedMovies = append(lowRatedMovies, value.FarthestClusters...)
			}
		}

		clustermap := make(map[string]int)
		for _, clusterId := range highRatedMovies {
			if clustermap[clusterId] == 0 {
				clustermap[clusterId] = 1
			} else {
				clustermap[clusterId] += 1
			}
		}

		for _, clusterId := range lowRatedMovies {
			if clustermap[clusterId] == 0 {
				clustermap[clusterId] = 1
			}
		}

		clusterCount := []ClusterCount{}
		for k, v := range clustermap {
			clusterCount = append(clusterCount, ClusterCount{
				ClusterID: k,
				Count:		 v,
			})
		}

		sort.Slice(clusterCount[:], func(i, j int) bool {
		  return clusterCount[i].Count > clusterCount[j].Count
		})

		bestClusters := []string{}
		for idx, value := range clusterCount {
			if idx < 5 {
				bestClusters = append(bestClusters, value.ClusterID)
			}
		}

		var bestMovies []*model.Movie
		if err := db.Limit(limit).
			Where("cluster_id in (?)", bestClusters).
			Where("year >= ? and year <= ?", minYear, maxYear).
			Order("num_rating desc").
			Find(&bestMovies).Error; err != nil {
			RenderError(w, err.Error(), http.StatusInternalServerError)
			return
		}

		var highMovies []*model.Movie
		if len(bestMovies) < 301 {
			if err := db.Limit(limit).
				Where("cluster_id in (?)", highRatedMovies).
				Where("year >= ? and year <= ?", minYear, maxYear).
				Order("num_rating desc").
				Find(&highMovies).Error; err != nil {
				RenderError(w, err.Error(), http.StatusInternalServerError)
				return
			}
		}

		var lowMovies []*model.Movie
		if len(bestMovies) < 301 {
			if err := db.Limit(limit).
				Where("cluster_id in (?)", lowRatedMovies).
				Where("year >= ? and year <= ?", minYear, maxYear).
				Order("num_rating desc").
				Find(&lowMovies).Error; err != nil {
				RenderError(w, err.Error(), http.StatusInternalServerError)
				return
			}
		}

		var movies []*model.Movie
		movies = append(bestMovies, highMovies...)
		movies = append(movies, lowMovies...)

		var extraMovies []*model.Movie
		if len(movies) < 301 {
			diff := 301 - len(movies) + 200
			if err := db.Limit(diff).
				Where("year >= ? and year <= ?", minYear, maxYear).
				Order("num_rating desc").
				Find(&extraMovies).Error; err != nil {
				RenderError(w, err.Error(), http.StatusInternalServerError)
				return
			}
			movies = append(movies, extraMovies...)
		}

		recommendMap := make(map[*model.Movie]int)
		for _, movie := range movies {
			if recommendMap[movie] == 0 {
				recommendMap[movie] = 1
			}
		}

		uniqueMovies := []*model.Movie{}
		for k, _ := range recommendMap {
			uniqueMovies = append(uniqueMovies, k)
		}

		tempRecommendations := make([]*model.Movie, 0, 10)
		rand.Seed(time.Now().UTC().UnixNano())
		for len(tempRecommendations) != 10 {
			j := rand.Intn(len(uniqueMovies) - 1)
			id := uniqueMovies[j].ID
			if _, ok := movieRatings[id]; ok {
				continue
			}

			if _, ok := skipped[id]; ok {
				continue
			}

			tempRecommendations = append(tempRecommendations, uniqueMovies[j])
		}

		recommendations := make([]*model.Movie, 0, 10)
		for _, cluster := range bestClusters {
			for _, movie := range tempRecommendations {
				id, _ := strconv.ParseUint(cluster, 10, 32)
				if uint(id) == movie.ClusterID {
					recommendations = append(recommendations, movie)
				}
			}
		}

		if bytes, err := json.Marshal(recommendations); err != nil {
			RenderError(w, err.Error(), http.StatusInternalServerError)
		} else {
			w.WriteHeader(http.StatusOK)
			w.Write(bytes)
		}
	}
}

type RecommendationRequestPayload struct {
	MaxYear    uint   `json:"max"`
	MinYear    uint   `json:"min"`
	Percentile uint   `json:"percent"`
	Skipped    []uint `json:"skipped"`
}

func NewPersonalizedRecommendationHandler(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		decoder := json.NewDecoder(r.Body)

		var payload RecommendationRequestPayload
		if err := decoder.Decode(&payload); err != nil {
			RenderError(w, "failed to parse request JSON into struct", http.StatusInternalServerError)
			return
		}

		var maxYear uint = 2018
		var minYear uint = 1930
		if payload.MaxYear != 0 {
			maxYear = payload.MaxYear
		}

		if payload.MinYear != 0 {
			minYear = payload.MinYear
		}

		// Find current user and get his/her ratings
		vars := mux.Vars(r)
		var currentUser model.User
		if err := db.Where("id = ?", vars["id"]).Preload("Ratings").First(&currentUser).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				RenderError(w, "user does not exist", http.StatusBadRequest)
				return
			}
			RenderError(w, err.Error(), http.StatusInternalServerError)
			return
		}

		// Convert ratings into a set of rated movie ID's
		rated := map[uint]bool{}
		for _, rating := range currentUser.Ratings {
			rated[rating.MovieID] = true
		}

		// Convert skipped movies into a set of skipped movie ID's
		skipped := map[uint]bool{}
		for _, movieID := range payload.Skipped {
			skipped[movieID] = true
		}

		// Count how many movies there are in the database
		var movieCount int
		if err := db.Model(&model.Movie{}).Count(&movieCount).Error; err != nil {
			RenderError(w, err.Error(), http.StatusInternalServerError)
			return
		}

		var percentage float64
		switch payload.Percentile {
		case 100:
			// Give user the top 1% of most rated movies
			percentage = 0.01
		case 80:
			// Giver user the top 20% of most rated movies
			percentage = 0.2
		case 60:
			// Give user the top 40% of the most rated movies
			percentage = 0.4
		case 40:
			// Give user the top 60% of the most rated movies
			percentage = 0.6
		case 20:
			// Give user the top 80% of the most rated movies
			percentage = 0.8
		default:
			percentage = 1.0
		}

		limit := int(float64(movieCount) * percentage)

		var movies []*model.Movie
		if err := db.Limit(limit).
			Where("year >= ? and year <= ?", minYear, maxYear).
			Order("num_rating desc").
			Find(&movies).Error; err != nil {
			RenderError(w, err.Error(), http.StatusInternalServerError)
			return
		}

		M := 0
		movieFeatureData := make([]float64, 0, len(movies))
		for _, movie := range movies {
			// Notice that not all movies have a feature vector, some movies were not even rated by any user. The
			// matrix factorization algorithm ignored those movies.
			if len(movie.Feature) > 0 {
				movieFeatureData = append(movieFeatureData, movie.Feature...)
				M += 1
			}
		}

		// K represents the feature dimension
		K := len(currentUser.Preference)
		userMat := mat.NewDense(1, K, currentUser.Preference)
		movieMat := mat.NewDense(M, K, movieFeatureData)

		if K == 0 {
			RenderError(w, "user has nil vector for latent preference", http.StatusInternalServerError)
			return
		}

		predictedRatings := mat.NewDense(1, M, nil)
		predictedRatings.Mul(userMat, movieMat.T())

		// Fetch 10 recommendations randomly
		rand.Seed(time.Now().UTC().UnixNano())
		recommendations := make([]*model.Movie, 0, 10)
		for len(recommendations) != 10 {
			j := rand.Intn(len(movies) - 1)
			if rated[movies[j].ID] {
				continue
			}

			if skipped[movies[j].ID] {
				continue
			}

			if predictedRatings.At(0, j) < 3.0 {
				continue
			}

			if movies[j].Year >= minYear && movies[j].Year <= maxYear && movies[j].NumRating >= 20 {
				recommendations = append(recommendations, movies[j])
			}
		}

		if bytes, err := json.Marshal(recommendations); err != nil {
			RenderError(w, err.Error(), http.StatusInternalServerError)
		} else {
			w.WriteHeader(http.StatusOK)
			w.Write(bytes)
		}
	}
}
