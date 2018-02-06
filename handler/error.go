package handler

import (
	"encoding/json"
	"net/http"
)

type ErrorResponse struct {
	Error string `json:"error"`
}

func RenderError(w http.ResponseWriter, errMsg string, code int) {
	res := &ErrorResponse{errMsg}
	bytes, _ := json.Marshal(res)
	w.WriteHeader(code) // http code
	w.Write(bytes)
}
