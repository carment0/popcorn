// Copyright (c) 2018 Popcorn
// Author(s) Calvin Feng

package handler

import (
	"encoding/json"
	"github.com/jinzhu/gorm"
	"popcorn/model"
	"golang.org/x/crypto/bcrypt"
	"net/http"
	"time"
)

type RegisterRequest struct {
	Username     string `json:"username"`
	Password 		 string `json:"password"`
}

func NewUserCreateHandler(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		decoder := json.NewDecoder(r.Body)

		var regReq RegisterRequest
		if err := decoder.Decode(&regReq); err != nil {
			RenderError(w, "Failed to parse request JSON into struct", http.StatusInternalServerError)
			return
		}
		if len(regReq.Email) == 0 || len(regReq.Password) == 0 || len(regReq.Username) == 0 {
			RenderError(w, "Please provide username and password for registration", http.StatusBadRequest)
			return
		}

		hashBytes, hashErr := bcrypt.GenerateFromPassword([]byte(regReq.Password), 10)
		if hashErr != nil {
			RenderError(w, hashErr.Error(), http.StatusInternalServerError)
			return
		}
		newUser := &model.User{
			Username:           regReq.Username,
			PasswordDigest: 		hashBytes,
		}

		newUser.ResetSessionToken()

		if err := db.Create(newUser).Error; err != nil {
			RenderError(w, err.Error(), http.StatusInternalServerError)
			return
		}

		expiration := time.Now().Add(2 * 24 * time.Hour)
		cookie := http.Cookie{Username: "session_token", Value: newUser.SessionToken, Expires: expiration}
		http.SetCookie(w, &cookie)

		res := &UserJSONResponse{
			Username:         newUser.Username,
			SessionToken: 		newUser.SessionToken,
		}

		if bytes, err := json.Marshal(res); err != nil {
			RenderError(w, err.Error(), http.StatusInternalServerError)
		} else {
			w.WriteHeader(http.StatusOK)
			w.Write(bytes)
		}
	}
}

type UserJSONResponse struct {
	Username        string `json:"username"`
	SessionToken 		string `json:"session_token"`
}

func NewUserListHandler(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var users []model.User
		if err := db.Find(&users).Error; err != nil {
			RenderError(w, err.Error(), http.StatusInternalServerError)
			return
		}

		res := []*UserJSONResponse{}
		for _, user := range users {
			res = append(res, &UserJSONResponse{
				Username:         user.Username,
				SessionToken: 		user.SessionToken,
			})
		}

		if bytes, err := json.Marshal(res); err != nil {
			RenderError(w, err.Error(), http.StatusInternalServerError)
		} else {
			w.WriteHeader(http.StatusOK)
			w.Write(bytes)
		}
	}
}
