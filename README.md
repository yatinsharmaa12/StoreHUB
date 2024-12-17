# 🚀 StoreHUB: Component Sharing Reimagined

## 📖 Overview

**StoreHUB** is a cutting-edge collaborative platform designed to revolutionize the way developers share, discover, and integrate code components. Built with a powerful tech stack of React, Go, and MySQL, StoreHUB provides a seamless ecosystem for developers to accelerate their development workflow.

## ✨ Key Features

- 🔍 **Comprehensive Component Library**: Browse and search through a diverse collection of reusable components
- 🤝 **Community-Driven**: Upload, share, and collaborate on innovative code snippets
- 🌐 **Multi-Framework Support**: Components spanning various frameworks and technologies
- 🔒 **Secure Authentication**: Robust user management and access controls
- 📊 **Detailed Component Insights**: Ratings, usage statistics, and community feedback

## 🛠 Tech Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| React | Frontend Framework | 18.x |
| Golang | Backend Services | 1.20+ |
| MySQL | Database Management | 8.0+ |
| Tailwind CSS | Styling | 3.x |
| JWT | Authentication | - |

## 🚦 Prerequisites

Before you begin, ensure you have the following installed:

- 🟢 Node.js (v16 or later)
- 🐹 Golang (v1.20 or later)
- 🐬 MySQL (v8.0 or later)
- 📦 npm (v8 or later)

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/storehub.git
cd storehub
```

### 2. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm start
```

### 3. Backend Setup
```bash
# Navigate to backend directory
cd ../backend

# Download dependencies
go mod tidy

# Set up configuration
cp config.example.yaml config.yaml

# Run database migrations
go run migrate/migrate.go

# Start backend server
go run main.go
```

### 4. Database Configuration
1. Create a MySQL database.
2. Update `backend/config.yaml` with your database credentials.
3. Run database migrations to set up schema.

---

## 🔐 Environment Variables

### Frontend (`.env`)
```
REACT_APP_API_BASE_URL=http://localhost:8080
REACT_APP_GITHUB_CLIENT_ID=your_github_client_id
```

### Backend (`config.yaml`)
```yaml
database:
  host: localhost
  port: 3306
  username: your_username
  password: your_password
  dbname: storehub

server:
  port: 8080
  jwt_secret: your_jwt_secret
```

### Email Setup

To enable email functionality (for sending emails like post creation notifications), you need to set up an email service using SMTP (e.g., Gmail). Follow these steps:

1. **Gmail SMTP Configuration**:  
   - You need to create a Google App Password if you're using Gmail with 2-factor authentication enabled.
   - Go to your Google account -> Security -> App Passwords -> Create a new app password for your application.
   - Add the following environment variables to your `.env` file:
     - `EMAIL`: Your Gmail address (e.g., `your-email@gmail.com`).
     - `PASSWORD`: The app password generated in the previous step.

2. **Other Email Providers**:  
   If you're using a different email provider (e.g., SendGrid, Mailgun), replace the SMTP configuration in the code accordingly and set up the relevant credentials.

---

### Sample `.env` File

Below is an example of what your `.env` file should look like. Copy this content into your `.env` file and replace the placeholders with your actual credentials.

```env
# Server Port
PORT=3000  # The port your backend server will run on.

# Production Database URL
DB_PRODUCTION="mysql://<username>:<password>@<host>:<port>/<database>?ssl-mode=REQUIRED"  
# Replace `<username>`, `<password>`, `<host>`, `<port>`, and `<database>` with your production database credentials.

# JWT Secret Key
JWTSECRET=<your_jwt_secret>  
# Secret key used for signing JSON Web Tokens. Replace `<your_jwt_secret>` with your key.

# Environment
ENV=<environment_name>  
# Define the environment, e.g., "production" or "development".

# Development Database URL
DB_DEVELOPMENT="<username>:<password>@tcp(<host>:<port>)/<database>?charset=utf8mb4&parseTime=True&loc=Local"  
# Replace `<username>`, `<password>`, `<host>`, `<port>`, and `<database>` with your development database credentials.

# Email Configuration (for sending emails)
EMAIL=<your_email_address>  # Your email address (e.g., your-email@gmail.com).
PASSWORD=<your_email_app_password>  # Your email app password (for Gmail, generate one from your Google account).
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Guidelines
- Follow existing code style
- Write tests for new features
- Update documentation
- Ensure CI checks pass

## 🧪 Running Tests

### Frontend Tests
```bash
cd frontend
npm test
```

### Backend Tests
```bash
cd backend
go test ./...
```

## 📜 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=yourusername/storehub)](https://star-history.com/#yourusername/storehub)

## 📞 Support

If you encounter any issues or have questions:
- Open a GitHub Issue
- Join our [Discord Community](https://discord.gg/your-invite-link)
- Email: support@storehub.dev

---

**Happy Coding! 👩‍💻👨‍💻**

