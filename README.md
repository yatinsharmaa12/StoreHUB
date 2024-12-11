
# StoreHUB

## Introduction
This project consists of a frontend built with React and a backend for authentication using Golang.

## Prerequisites
- Node.js and npm (for the React frontend)
- Golang (for the backend)

## Installation

### Frontend (React)
1. Navigate to the frontend directory:
   ```sh
   cd frontend
   ```

2. Install the dependencies:
   ```sh
   npm install
   ```

3. Start the development server:
   ```sh
   npm start
   ```

The React application should now be running on `http://localhost:3000`.

### Backend (Golang)
1. Navigate to the backend directory:
   ```sh
   cd backend
   ```

2. Install the dependencies:
   ```sh
   go mod tidy
   ```

3. Run the authentication server:
   ```sh
   go run main.go
   ```

The Golang authentication server should now be running on `http://localhost:8080`.

## Usage
- Use the React frontend to interact with the application.
- The frontend will communicate with the Golang backend for authentication and other backend services.

## Contributing
Please fork this repository and make a pull request if you wish to contribute.

## License
This project is licensed under the MIT License.
