package main

import (
	"fmt"
	"net/http"
	"strconv"
	"github.com/julienschmidt/httprouter"
)

func (app *application) venuesHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "Returning all venues")
	fmt.Fprintf(w, "environment: %s\n", app.config.env)
	fmt.Fprintf(w, "version: %s", version)
}

func (app *application) venueHandler(w http.ResponseWriter, r *http.Request) {
	params := httprouter.ParamsFromContext(r.Context())

	id, err := strconv.ParseInt(params.ByName("id"), 10, 64) // Base 10 64 bit
	if err != nil || id < 1 {
		http.NotFound(w, r)
		return 
	}
	
	fmt.Fprintf(w, "Show the details of the venue %d\n", id)
}