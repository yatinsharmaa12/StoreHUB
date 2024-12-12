FROM golang:1.23
WORKDIR /usr/src/app

# Copy go module files first to leverage Docker layer caching
COPY go.mod go.sum ./

# Download and verify dependencies
RUN go mod download && go mod verify

# Copy the rest of the application source code
COPY . .

# Build the application
RUN go build -v -o /usr/local/bin/myapp main.go

# Expose port 3000
EXPOSE 3000

# Set the default command to run the application
CMD ["/usr/local/bin/myapp"]
