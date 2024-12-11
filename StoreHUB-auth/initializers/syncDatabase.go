package initializers


import "github.com/rishyym0927/StoreHUB-auth/models"

func SyncDatabase() {
	DB.AutoMigrate(&models.User{})
}