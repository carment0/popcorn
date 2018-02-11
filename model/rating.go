// Copyright (c) 2018 Popcorn
// Author(s) Calvin Feng

package model

import "time"

type Rating struct {
	// Model base class attributes
	ID        uint      `gorm:"primary_key" json:"-"`
	CreatedAt time.Time `json:"-"`
	UpdatedAt time.Time `json:"-"`

	// Foreign Keys
	UserID  uint    `json:"user_id"`
	MovieID uint    `json:"movie_id"`
	Value   float64 `gorm:"type:float8" json:"rating"`
}
