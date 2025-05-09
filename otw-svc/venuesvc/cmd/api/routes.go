package main

import (
	"net/http"

	"github.com/julienschmidt/httprouter"
)

func (app *application) routes() http.Handler {
	router := httprouter.New()

	router.NotFound = http.HandlerFunc(app.notFoundResponse)
	router.MethodNotAllowed = http.HandlerFunc(app.methodNotAllowedResponse)

	router.HandlerFunc(http.MethodGet, "/v1/panic/panic/extremePanic", func(w http.ResponseWriter, r *http.Request) {
		panic("Something went wrong and here trying not to panic")
	})
	router.HandlerFunc(http.MethodGet, "/v1/healthcheck", app.healthCheckHandler)
	router.HandlerFunc(http.MethodGet, "/v1/venues", app.getVenuesHandler)
	router.HandlerFunc(http.MethodGet, "/v1/venues/:id", app.getVenueByIdHandler)
	router.HandlerFunc(http.MethodPost, "/v1/venus/:id", app.postVenueHandler)

	return app.recoverPanic(router)
}
