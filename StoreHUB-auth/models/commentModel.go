package models

import "gorm.io/gorm"

// Comment represents a comment on a post
type Comment struct {
	gorm.Model
	UserID uint   `gorm:"not null"` // Foreign key for User
	User   User   // Related user
	PostID uint   `gorm:"not null"` // Foreign key for Post
	Post   Post   // Related post
	Content string `gorm:"not null"` // Comment content
}
