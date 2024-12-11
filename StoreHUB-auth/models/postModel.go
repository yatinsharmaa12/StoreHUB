package models

import "gorm.io/gorm"

// Post represents a user-created post
type Post struct {
	gorm.Model
	UserID       uint     `gorm:"not null"` // Foreign key for User
	User         User     // Related user
	Title        string   `gorm:"not null"`
	Description  string   `gorm:"not null"`
	Images       string   `gorm:"type:text"` // Comma-separated image URLs
	CodeSnippet  string   `gorm:"type:text"`
	Framework    string   `gorm:"not null"`
	ComponentType string  `gorm:"not null"`
	Likes        []Like   `gorm:"constraint:OnDelete:CASCADE;"`
	Comments     []Comment `gorm:"constraint:OnDelete:CASCADE;"`
}
