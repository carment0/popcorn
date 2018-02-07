package model

import "time"

type User struct {
  // Model base class attributes
  ID        uint `gorm:"primary_key"`
  CreatedAt time.Time
  UpdatedAt time.Time

  // User base attributes
	Username        string    `gorm:"type:varchar(100)"json:"name"`
	SessionToken    string    `gorm:"type:varchar(100);unique_index"json:"session_token"`
	PasswordDigest  []byte    `gorm:"type:bytea"json:"password_digest"`
}

func (u *User) ResetSessionToken() {
	if randStr, err := GenerateRandomString(20); err == nil {
		u.SessionToken = randStr
	}
}
