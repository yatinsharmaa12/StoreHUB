package initializers

import (
	"crypto/tls"
	"crypto/x509"
	"fmt"
	"log"
	"net/url"
	"os"
	"path/filepath"
	"strings"

	mysqlDriver "github.com/go-sql-driver/mysql"
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

		// Possible certificate paths
		possiblePaths := []string{
			"./certs/mysql-ca.pem",
			"../certs/mysql-ca.pem",
			"certs/mysql-ca.pem",
			filepath.Join(os.Getenv("USERPROFILE"), "OneDrive", "Desktop", "ui-platform", "StoreHUB-auth", "certs", "mysql-ca.pem"),
		}

		var certPath string
		var caCert []byte

		// Try multiple paths
		for _, path := range possiblePaths {
			absPath, err := filepath.Abs(path)
			if err != nil {
				log.Printf("Error resolving absolute path for %s: %v", path, err)
				continue
			}

			log.Printf("Trying certificate path: %s", absPath)

			caCert, err = os.ReadFile(absPath)
			if err == nil {
				certPath = absPath
				break
			}
		}

		// If no certificate found
		if len(caCert) == 0 {
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
		} else {
			// Load custom CA certificate
			caCertPool := x509.NewCertPool()
			if ok := caCertPool.AppendCertsFromPEM(caCert); !ok {
				log.Fatalf("Failed to append CA certificate from %s", certPath)
			}

			// Configure TLS
			tlsConfig := &tls.Config{
				RootCAs: caCertPool,
				// Uncomment the next line if your certificate doesn't match the hostname
				// InsecureSkipVerify: true,
			}

			// Register TLS configuration
			err = mysqlDriver.RegisterTLSConfig("custom", tlsConfig)
			if err != nil {
				log.Fatalf("Failed to register TLS config: %v", err)
			}

			// Construct DSN in the format Gorm expects
			connectionString := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local&tls=custom",
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
