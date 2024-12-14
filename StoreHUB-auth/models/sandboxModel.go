package models

import "gorm.io/gorm"

// Post represents a user-created post
type Sandbox struct {
	gorm.Model
	UserID      uint   `gorm:"not null"` // Foreign key for User
	User        User   // Related user
	Title       string `gorm:"not null"`
	Description string `gorm:"not null"`
	Elink        string `gorm:"not null"`
}
