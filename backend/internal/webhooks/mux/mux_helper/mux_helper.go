package mux_helper

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"fmt"
	"os"
	"strings"
)

func generateHmacSignature(webhookSecret, payload string) string {
	h := hmac.New(sha256.New, []byte(webhookSecret))
	h.Write([]byte(payload))
	return hex.EncodeToString(h.Sum(nil))
}

func IsValidMuxSignature(muxSignature string, body []byte) error {
	if muxSignature == "" {
		return errors.New("no Mux-Signature in request header")
	}

	muxSignatureArr := strings.Split(muxSignature, ",")

	if len(muxSignatureArr) != 2 {
		return errors.New(fmt.Sprintf("Mux-Signature in request header should be 2 values long: %s", muxSignatureArr))
	}

	timestampArr := strings.Split(muxSignatureArr[0], "=")
	v1SignatureArr := strings.Split(muxSignatureArr[1], "=")

	if len(timestampArr) != 2 || len(v1SignatureArr) != 2 {
		return errors.New(fmt.Sprintf("missing timestamp: %s or missing v1Signature: %s", timestampArr, v1SignatureArr))
	}

	timestamp := timestampArr[1]
	v1Signature := v1SignatureArr[1]

	webhookSecret := os.Getenv("MUX_WEBHOOK_SECRET")
	payload := fmt.Sprintf("%s.%s", timestamp, string(body))
	sha := generateHmacSignature(webhookSecret, payload)

	if sha != v1Signature {
		return errors.New("not a valid mux webhook signature")
	}

	return nil
}
