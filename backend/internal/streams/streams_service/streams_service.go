package streams_service

import (
	muxgo "github.com/muxinc/mux-go/v6"
	"github.com/waxer59/watchMe/config"
)

var muxClient = muxgo.NewAPIClient(
	muxgo.NewConfiguration(
		muxgo.WithBasicAuth(config.GetEnv("MUX_ACCESS_TOKEN"), config.GetEnv("MUX_SECRET_KEY")),
	),
)

func GenerateStreamKey(channelId string) (muxgo.LiveStreamResponse, error) {
	streamParams, err := muxClient.LiveStreamsApi.CreateLiveStream(muxgo.CreateLiveStreamRequest{
		PlaybackPolicy: []muxgo.PlaybackPolicy{muxgo.PUBLIC},
		LatencyMode:    "low",
		NewAssetSettings: muxgo.CreateAssetRequest{
			PlaybackPolicy: []muxgo.PlaybackPolicy{muxgo.PUBLIC},
		},
	})

	return streamParams, err
}

func DeleteStreamKey(streamKeyId string) error {
	err := muxClient.LiveStreamsApi.DeleteLiveStream(streamKeyId)

	return err
}
