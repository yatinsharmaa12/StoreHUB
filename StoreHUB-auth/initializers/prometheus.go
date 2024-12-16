
package initializers

import (
	"github.com/prometheus/client_golang/prometheus"
)

// Define Prometheus metrics globally
var RequestCounter *prometheus.CounterVec

// InitPrometheus initializes Prometheus metrics
func InitPrometheus() {
	// Create a new counter for request counts
	RequestCounter = prometheus.NewCounterVec(
		prometheus.CounterOpts{
			Name: "app_requests_total",
			Help: "Total number of requests processed by the application",
		},
		[]string{"method", "endpoint"},
	)
	// Register the metric
	prometheus.MustRegister(RequestCounter)
}
