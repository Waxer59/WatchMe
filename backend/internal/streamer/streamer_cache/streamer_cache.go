package streamer_cache

import (
	"context"
	"fmt"
	"strings"

	"github.com/waxer59/watchMe/redis"
)

func IsUserStreamingByUserId(userId string) (bool, error) {
	ctx := context.Background()

	exists, err := redis.RedisClient.Exists(ctx, fmt.Sprintf("user_streaming:%s", userId)).Result()

	if err != nil {
		return false, err
	}

	if exists == 0 {
		return false, nil
	}

	return true, nil
}

func SetUserStreamingByUserId(userId string, streamId string) error {
	ctx := context.Background()

	err := redis.RedisClient.Set(ctx, fmt.Sprintf("user_streaming:%s", userId), streamId, 0).Err()

	if err != nil {
		return err
	}

	return nil
}

func GetStreamingIdByUserId(userId string) (string, error) {
	ctx := context.Background()

	streamId, err := redis.RedisClient.Get(ctx, fmt.Sprintf("user_streaming:%s", userId)).Result()

	if err != nil {
		return "", err
	}

	return streamId, nil
}

func DeleteUserStreamingByUserId(userId string) error {
	ctx := context.Background()

	err := redis.RedisClient.Del(ctx, fmt.Sprintf("user_streaming:%s", userId)).Err()

	if err != nil {
		return err
	}

	return nil
}

func GetUsersIdsStreaming() ([]string, error) {
	ctx := context.Background()

	var cursor uint64
	var keys []string
	prefix := "user_streaming:*"
	for {
		ks, c, err := redis.RedisClient.Scan(ctx, cursor, prefix, 100).Result()

		if err != nil {
			return nil, err
		}

		keys = append(keys, ks...)
		cursor = c

		if cursor == 0 {
			break
		}
	}

	// Remove the prefix from the keys
	for i, key := range keys {
		keys[i] = strings.TrimPrefix(key, "user_streaming:")
	}

	return keys, nil
}
