package main

import (
	"net/http"

	"github.com/julienschmidt/httprouter"
)

func (app *application) routes() http.Handler {
	router := httprouter.New()

	router.NotFound = http.HandlerFunc(app.notFoundResponse)
	router.MethodNotAllowed = http.HandlerFunc(app.methodNotAllowedResponse)

	router.HandlerFunc(http.MethodGet, "/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"message": "OTW Venue Service is running."}`))
	})
	router.HandlerFunc(http.MethodGet, "/v1/panic/panic/extremePanic", func(w http.ResponseWriter, r *http.Request) {
		panic("Something went wrong and here trying not to panic")
	})
	router.HandlerFunc(http.MethodGet, "/v1/healthcheck", app.healthCheckHandler)

	router.HandlerFunc(http.MethodGet, "/v1/venues", app.getVenuesHandler)
	router.HandlerFunc(http.MethodPost, "/v1/venues", app.postVenueHandler)

	router.HandlerFunc(http.MethodGet, "/v1/venues/:id", app.getVenueByIdHandler)
	router.HandlerFunc(http.MethodGet, "/v1/venues/:id/checkin", app.getCheckinsByVenueHandler)
	router.HandlerFunc(http.MethodPost, "/v1/venues/:id/checkin", app.postCheckinHandler)

	router.HandlerFunc(http.MethodGet, "/v1/checkins/count", app.getTotalCheckinsHandler)

	return app.enableCORS(app.recoverPanic(router))
}
