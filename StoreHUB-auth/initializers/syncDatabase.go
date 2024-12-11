package initializers

import (
	"log"

	"github.com/rishyym0927/StoreHUB-auth/models"
)

func SyncDatabase() {
	DB.AutoMigrate()
	if err := DB.AutoMigrate(&models.User{}, &models.Post{}, &models.Like{}, &models.Comment{}); err != nil {
		log.Fatalf("Error migrating models: %v", err)
	}
}