package initializers

import (
	"fmt"
	"log"
	"net/url"
	"os"
	"strings"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectToDB() {
	// Get the environment
	env := os.Getenv("ENV")

	var dsn string
	if env == "production" {
		// Use production database connection
		dsn = os.Getenv("DB_PRODUCTION")
		if dsn == "" {
			log.Fatal("Production database connection string is not set")
		}

		// Parse the connection URL
		parsedURL, err := url.Parse(dsn)
		if err != nil {
			log.Fatalf("Failed to parse connection string: %v", err)
		}

		// Extract components
		username := parsedURL.User.Username()
		password, _ := parsedURL.User.Password()
		host := parsedURL.Hostname()
		port := parsedURL.Port()
		dbName := strings.TrimPrefix(parsedURL.Path, "/")

	
		// Try multiple paths
		

		// If no certificate found
		
			log.Println("Warning: No CA certificate found. Proceeding without SSL verification.")

			// Construct DSN without TLS
			connectionString := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
				username,
				password,
				host,
				port,
				dbName,
			)

			DB, err = gorm.Open(mysql.Open(connectionString), &gorm.Config{})
			if err != nil {
				log.Fatalf("Failed to connect to database: %v", err)
			}
		
		sqlDB, err := DB.DB()
		if err != nil {
			log.Fatalf("Failed to get database: %v", err)
		}

		if err := sqlDB.Ping(); err != nil {
			log.Fatalf("Failed to ping database: %v", err)
		}

		log.Println("Successfully connected to the database (production)")
	} else {
		// Use local MySQL instance
		dsn = os.Getenv("DB")
        var err error
        DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
        if err != nil {
            panic("failed to connect database")
        }

		log.Println("Successfully connected to the database (local)")
	}

}
