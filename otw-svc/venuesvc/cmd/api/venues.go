package main

import (
	"fmt"
	"net/http"
	"time"

	"venuesvc.otw.net/internal/data"
)

func (app *application) getVenuesHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "Returning all venues")
	fmt.Fprintf(w, "environment: %s\n", app.config.env)
	fmt.Fprintf(w, "version: %s", version)
}

func (app *application) getVenueByIdHandler(w http.ResponseWriter, r *http.Request) {
	id, err := app.readIDParam(r)

	if err != nil {
		app.notFoundResponse(w, r)
		return
	}

	venue := data.Venue{
		ID:          id,
		CreatedAt:   time.Now(),
		Name:        "Mcdonalds",
		Description: "Mcdonalds Columbus, Ohio",
		Addr:        "123 Mcdonalds Ave, Columbus, Ohio, 43235",
		Tags:        []string{"Fast Food", "Restuarant", "Dine In", "Drive-tru"},
		Version:     1,
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"venue": venue}, nil)

	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) postVenueHandler(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Name        string   `json:"name"`
		Description string   `json:"description"`
		Addr        string   `json:"addr"`
		Tags        []string `json:"tags"`
	}

	err := app.readJSON(nil, r, &input)

	if err != nil {
		app.badReqestResponse(w, r, err)
		app.errorResponse(w, r, http.StatusBadRequest, err.Error())
	}

	fmt.Fprintf(w, "%+v\n", input)
}
