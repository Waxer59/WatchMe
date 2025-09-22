package viewers_service

import (
	"context"
	"errors"
	"fmt"
	"strconv"

	"github.com/waxer59/watchMe/redis"
)

type Viewers struct {
	Count    int    `json:"count" redis:"count"`
	Category string `json:"category" redis:"category"`
}

func IncrementViewerCount(userId string) (int, error) {
	context := context.Background()

	viewers, err := GetViewersHashByUserId(userId)

	if err != nil {
		return 0, err
	}

	if viewers.Category == "" {
		return 0, errors.New("stream not active")
	}

	viewers.Count++

	redis.RedisClient.HSet(context, fmt.Sprintf("viewers:%s", userId), viewers)

	return viewers.Count, nil
}

func DecrementViewerCount(userId string) (int, error) {
	context := context.Background()

	viewers, err := GetViewersHashByUserId(userId)

	if err != nil {
		return 0, err
	}

	if viewers.Category == "" {
		return 0, errors.New("stream not active")
	}

	viewers.Count--

	redis.RedisClient.HSet(context, fmt.Sprintf("viewers:%s", userId), viewers)

	return viewers.Count, nil
}

func GetViewerCount(userId string) (int64, error) {
	context := context.Background()

	count, err := redis.RedisClient.HGet(context, fmt.Sprintf("viewers:%s", userId), "count").Result()

	if err != nil {
		return 0, err
	}

	return strconv.ParseInt(count, 10, 64)
}

func ChangeCategoryViewerCount(userId string, category string) error {
	context := context.Background()

	// Check if the key exists
	// If not omit all the process
	exists, err := redis.RedisClient.Exists(context, fmt.Sprintf("viewers:%s", userId)).Result()

	if err != nil {
		return err
	}

	if exists == 0 {
		return nil
	}

	viewers, err := GetViewersHashByUserId(userId)

	if err != nil {
		return err
	}

	viewers.Category = category

	redis.RedisClient.HSet(context, fmt.Sprintf("viewers:%s", userId), viewers)

	return nil
}

func GetViewerCountByCategory(category string) (int, error) {
	ctx := context.Background()

	var cursor uint64
	var keys []string
	prefix := "viewers:*"

	// Get all keys matching the prefix
	for {
		ks, c, err := redis.RedisClient.Scan(ctx, cursor, prefix, 100).Result()

		if err != nil {
			fmt.Println(err.Error())
			return 0, err
		}

		keys = append(keys, ks...)
		cursor = c

		if cursor == 0 {
			break
		}
	}

	var viewers Viewers
	totalCount := 0

	// Count the members of the category
	for _, key := range keys {
		err := redis.RedisClient.HGetAll(ctx, key).Scan(&viewers)

		if err != nil {
			fmt.Println(err.Error())
			return 0, err
		}

		if viewers.Category == category {
			totalCount += viewers.Count
		}
	}

	return totalCount, nil
}

func GetViewersHashByUserId(userId string) (Viewers, error) {
	context := context.Background()

	var viewers Viewers

	err := redis.RedisClient.HGetAll(context, fmt.Sprintf("viewers:%s", userId)).Scan(&viewers)

	if err != nil {
		return Viewers{}, err
	}

	return viewers, nil
}

func DeleteViewerCount(userId string) error {
	context := context.Background()

	err := redis.RedisClient.Del(context, fmt.Sprintf("viewers:%s", userId)).Err()

	if err != nil {
		return err
	}

	return nil
}

func CreateViewers(userId string, viewers Viewers) error {
	context := context.Background()

	err := redis.RedisClient.HSet(context, fmt.Sprintf("viewers:%s", userId), viewers).Err()

	if err != nil {
		return err
	}

	return nil
}

func SetViewersByUserId(userId string, count int) error {
	context := context.Background()

	viewers, err := GetViewersHashByUserId(userId)

	if err != nil {
		return err
	}

	viewers.Count = count

	err = redis.RedisClient.HSet(context, fmt.Sprintf("viewers:%s", userId), viewers).Err()

	if err != nil {
		return err
	}

	return nil
}
