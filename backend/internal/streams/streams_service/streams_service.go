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

func GenerateStreamKey(channelId string) (string, error) {
	streamParams, err := muxClient.LiveStreamsApi.CreateLiveStream(muxgo.CreateLiveStreamRequest{
		PlaybackPolicy: []muxgo.PlaybackPolicy{muxgo.PUBLIC},
		LatencyMode:    "low",
		NewAssetSettings: muxgo.CreateAssetRequest{
			PlaybackPolicy: []muxgo.PlaybackPolicy{muxgo.PUBLIC},
		},
	})

	return streamParams.Data.StreamKey, err
}
