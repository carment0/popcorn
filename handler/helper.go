package handler

import (
	"github.com/jinzhu/gorm"
	"golang.org/x/crypto/bcrypt"
	"popcorn/model"
)

func FindUserByCredential(db *gorm.DB, username, password string) (*model.User, error) {
	var user model.User
	//.Where returns a array
	if err := db.Where("username = ?", username).First(&user).Error; err != nil {
		return nil, err
	}

	if err := bcrypt.CompareHashAndPassword(user.PasswordDigest, []byte(password)); err != nil {
		return nil, err
	}

	return &user, nil
}

func FindUserByToken(db *gorm.DB, token string) (*model.User, error) {
	var user model.User
	if err := db.Where("session_token = ?", token).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}
