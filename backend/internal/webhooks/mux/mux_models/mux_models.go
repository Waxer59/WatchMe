package mux_models

type MuxWebhook struct {
	Id     string `json:"id"`
	Type   string `json:"type"`
	Object struct {
		Type string `json:"type"`
		Id   string `json:"id"`
	} `json:"object"`
	Environment struct {
		Name string `json:"name"`
		Id   string `json:"id"`
	} `json:"environment"`
	Data struct {
		Warning struct {
			Type    string `json:"type"`
			Message string `json:"message"`
		} `json:"warning"`
		StreamKey     string `json:"stream_key"`
		Status        string `json:"status"`
		Id            string `json:"id"`
		ActiveAssetId string `json:"active_asset_id"`
	} `json:"data"`
	CreatedAt      string      `json:"created_at"`
	AccessorSource interface{} `json:"accessor_source"`
	Accessor       interface{} `json:"accessor"`
	RequestId      interface{} `json:"request_id"`
}
