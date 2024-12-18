package models

import (
	"gorm.io/gorm"
)

type Chat struct {
    gorm.Model
    UserID  uint   `gorm:"not null"`
    Channel string `gorm:"not null"`
    Content string `gorm:"type:text;not null"`
}
