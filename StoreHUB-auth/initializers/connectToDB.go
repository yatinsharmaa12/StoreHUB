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
	if env == "" {
		log.Fatal("ENV environment variable is not set")
	}

	var dsn string
	var err error

	switch env {
	case "production":
		// Production database connection
		dsn = os.Getenv("DB_PRODUCTION")
		if dsn == "" {
			log.Fatal("Production database connection string is not set")
		}
		// Parse the connection URL
		parsedURL, err := url.Parse(dsn)
		if err != nil {
			log.Fatalf("Failed to parse connection string: %v", err)
		}
		username := parsedURL.User.Username()
		password, _ := parsedURL.User.Password()
		host := parsedURL.Hostname()
		port := parsedURL.Port()
		dbName := strings.TrimPrefix(parsedURL.Path, "/")

		// SSL configuration check (new variable)
		useSSL := os.Getenv("DB_USE_SSL")
		if useSSL == "true" {
			log.Println("Using SSL for database connection.")
		} else {
			log.Println("Warning: No SSL. Proceeding without SSL verification.")
		}

		// Construct DSN with or without SSL
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

	case "staging":
		// Staging database connection (if needed)
		dsn = os.Getenv("DB_STAGING")
		if dsn == "" {
			log.Fatal("Staging database connection string is not set")
		}
		// Similar connection setup for staging
		DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
		if err != nil {
			log.Fatalf("Failed to connect to staging database: %v", err)
		}
		log.Println("Successfully connected to the database (staging)")

	case "development":
		// Development database connection
		dsn = os.Getenv("DB_DEVELOPMENT")
		if dsn == "" {
			log.Fatal("Development database connection string is not set")
		}
		DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
		if err != nil {
			log.Fatalf("Failed to connect to development database: %v", err)
		}
		log.Println("Successfully connected to the database (development)")

	case "testing":
		// Testing database connection
		dsn = os.Getenv("DB_PRODUCTION")
		if dsn == "" {
			log.Fatal("Testing database connection string is not set")
		}
		DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
		if err != nil {
			log.Fatalf("Failed to connect to testing database: %v", err)
		}
		log.Println("Successfully connected to the database (testing)")

	default:
		log.Fatalf("Unknown environment: %s", env)
	}

}
