package models

import "gorm.io/gorm"

// Like represents a like on a post
type Like struct {
	gorm.Model
	UserID uint `gorm:"not null"` // Foreign key for User
	User   User // Related user
	PostID uint `gorm:"not null"` // Foreign key for Post
	Post   Post // Related post
}
