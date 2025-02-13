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

func ParseJwtToken(tokenString string) (jwt.MapClaims, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return []byte(config.GetEnv("JWT_SECRET_KEY")), nil
	})

	if err != nil {
		return nil, err
	}

	claims, ok := token.Claims.(jwt.MapClaims)

	if !ok {
		return nil, err
	}

	return claims, nil
}
