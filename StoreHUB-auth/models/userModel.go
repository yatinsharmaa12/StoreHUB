

package models

import "gorm.io/gorm"

// User represents a registered user in the system
type User struct {
	gorm.Model
	FirstName    string    `gorm:"not null"`
	LastName     string    `gorm:"not null"`
	Username     string    `gorm:"unique;not null"`
	Email        string    `gorm:"unique;not null"`
	Password     string    `gorm:"not null"`
	ProfilePhoto string    `gorm:"default:'default-profile.png'"`
	Bio          string    `gorm:"type:text"` // Optional user bio
	Status       string    `gorm:"type:varchar(50);default:'active'"` // Account status
	Posts        []Post    `gorm:"constraint:OnDelete:CASCADE;"` // Relation to Posts
	Likes        []Like    `gorm:"constraint:OnDelete:CASCADE;"` // Relation to Likes
	Comments     []Comment `gorm:"constraint:OnDelete:CASCADE;"` // Relation to Comments
}
