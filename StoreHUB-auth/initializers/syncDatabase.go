package initializers

import (
	"log"

	"github.com/rishyym0927/StoreHUB-auth/models"
)

func SyncDatabase() {
    if err := DB.AutoMigrate(&models.User{}, &models.Post{}, &models.Like{}, &models.Comment{}, &models.Sandbox{}); err != nil {
        log.Fatalf("Error migrating models: %v", err)
    }
}