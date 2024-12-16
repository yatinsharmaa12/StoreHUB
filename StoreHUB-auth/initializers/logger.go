
package initializers

import (
	"go.uber.org/zap"
)

var SugarLogger *zap.SugaredLogger


func InitLogger() {
	logger, err := zap.NewProduction()
	if err != nil {
		panic(err)
	}
	SugarLogger = logger.Sugar()
}
