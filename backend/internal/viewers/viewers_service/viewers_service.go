package viewers_service

import (
	"context"
	"fmt"
	"strconv"

	"github.com/waxer59/watchMe/internal/streams/streams_entities"
	"github.com/waxer59/watchMe/redis"
)

type Viewers struct {
	Count    int64  `json:"count" redis:"count"`
	Category string `json:"category" redis:"category"`
}

func IncrementViewerCount(streamId string) (int, error) {
	context := context.Background()

	count, err := redis.RedisClient.HGet(context, fmt.Sprintf("viewers:%s", streamId), "count").Result()

	if err != nil {
		redis.RedisClient.HSet(context, fmt.Sprintf("viewers:%s", streamId), 1, 0)
		return 0, err
	}

	countInt, err := strconv.ParseInt(count, 10, 64)

	if err != nil {
		return 0, err
	}

	redis.RedisClient.HIncrBy(context, fmt.Sprintf("viewers:%s", streamId), "count", 1)

	return int(countInt) + 1, nil
}

func DecrementViewerCount(streamId string) (int, error) {
	context := context.Background()

	viewers, err := redis.RedisClient.HGet(context, fmt.Sprintf("viewers:%s", streamId), "count").Result()

	if err != nil {
		return 0, err
	}

	viewersInt, err := strconv.ParseInt(viewers, 10, 64)

	if err != nil {
		return 0, err
	}

	if viewersInt == 0 {
		return 0, nil
	}

	redis.RedisClient.HIncrBy(context, fmt.Sprintf("viewers:%s", streamId), "count", -1)

	return int(viewersInt) - 1, nil
}

func GetViewerCount(streamId string) (int64, error) {
	context := context.Background()

	count, err := redis.RedisClient.HGet(context, fmt.Sprintf("viewers:%s", streamId), "count").Result()

	if err != nil {
		return 0, err
	}

	return strconv.ParseInt(count, 10, 64)
}

func ChangeCategoryViewerCount(streamId string, category string) error {
	context := context.Background()

	// Check if the key exists
	// If not omit all the process
	exists, err := redis.RedisClient.Exists(context, fmt.Sprintf("viewers:%s", streamId)).Result()

	if err != nil {
		return err
	}

	if exists == 0 {
		return nil
	}

	_, err = redis.RedisClient.HGet(context, fmt.Sprintf("viewers:%s", streamId), "category").Result()

	if err != nil {
		redis.RedisClient.HSet(context, fmt.Sprintf("viewers:%s", streamId), "category", category)
		return err
	}

	return nil
}

func GetViewerCountByCategory(category streams_entities.StreamCategory) (int64, error) {
	// TODO
	return 0, nil
}

func DeleteViewerCount(streamId string) error {
	context := context.Background()

	err := redis.RedisClient.Del(context, fmt.Sprintf("viewers:%s", streamId)).Err()

	if err != nil {
		return err
	}

	return nil
}

func CreateViewers(streamId string, viewers Viewers) error {
	context := context.Background()

	err := redis.RedisClient.HSet(context, fmt.Sprintf("viewers:%s", streamId), viewers).Err()

	if err != nil {
		return err
	}

	return nil
}
