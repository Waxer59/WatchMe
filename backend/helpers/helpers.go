package helpers

import (
	"net/url"
	"strings"
)

func GetDomainFromUrl(urlStr string) (string, error) {
	url, err := url.Parse(urlStr)

	if err != nil {
		return "", err
	}

	parts := strings.Split(url.Hostname(), ".")
	domain := parts[len(parts)-2] + "." + parts[len(parts)-1]

	return domain, nil
}
