package models

import "gorm.io/gorm"


type User struct {
	gorm.Model
	FirstName   string `gorm:"not null"`
	LastName    string `gorm:"not null"`
	Username    string `gorm:"unique;not null"`
	Email       string `gorm:"unique;not null"`
	Password    string `gorm:"not null"`
	ProfilePhoto string `gorm:"default:'default-profile.png'"`
}
