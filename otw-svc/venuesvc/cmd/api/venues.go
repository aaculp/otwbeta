package main

import (
	"fmt"
	"net/http"
)

func (app *application) getVenuesHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "Returning all venues")
	fmt.Fprintf(w, "environment: %s\n", app.config.env)
	fmt.Fprintf(w, "version: %s", version)
}

func (app *application) getVenueByIdHandler(w http.ResponseWriter, r *http.Request) {
	id, err := app.readIDParam(r)

	if err != nil {
		http.NotFound(w, r)
		return
	}

	fmt.Fprintf(w, "Show the details of the venue %d\n", id)
}
