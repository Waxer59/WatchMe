package jwt_utils

import (
	"github.com/golang-jwt/jwt/v5"
	"github.com/waxer59/watchMe/config"
)

func GenerateJwtToken(claims jwt.MapClaims) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, err := token.SignedString([]byte(config.GetEnv("JWT_SECRET_KEY")))

	if err != nil {
		return "", err
	}

	return tokenString, nil
}
