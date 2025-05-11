package main

import (
	"errors"
	"net/http"
	"time"

	"venuesvc.otw.net/internal/data"
)

func (app *application) getVenuesHandler(w http.ResponseWriter, r *http.Request) {
	venues, err := app.venueModel.GetAll()

	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"venues": venues}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) getVenueByIdHandler(w http.ResponseWriter, r *http.Request) {
	id, err := app.readIDParam(r)

	if err != nil {
		app.notFoundResponse(w, r)
		return
	}

	venue, err := app.venueModel.Get(id)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			app.notFoundResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}
	}

	// venue := data.Venue{
	// 	ID:          id,
	// 	CreatedAt:   time.Now(),
	// 	Name:        "Mcdonalds",
	// 	Description: "Mcdonalds Columbus, Ohio",
	// 	Addr:        "123 Mcdonalds Ave, Columbus, Ohio, 43235",
	// 	Tags:        []string{"Fast Food", "Restuarant", "Dine In", "Drive-tru"},
	// 	Version:     1,
	// }

	err = app.writeJSON(w, http.StatusOK, envelope{"venue": venue}, nil)

	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) getTotalCheckinsHandler(w http.ResponseWriter, r *http.Request) {
	count, err := app.venueModel.GetTotalCheckins()

	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	app.writeJSON(w, http.StatusOK, envelope{"count": count}, nil)
}

func (app *application) getCheckinsByVenueHandler(w http.ResponseWriter, r *http.Request) {
	id, err := app.readIDParam(r)
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}

	count, err := app.venueModel.CountCheckins(id)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}

	app.writeJSON(w, http.StatusOK, envelope{"checkinCount": count}, nil)
}

func (app *application) postVenueHandler(w http.ResponseWriter, r *http.Request) {
	newVenue := data.Venue{}
	newVenue.Version = 1
	newVenue.CreatedAt = time.Now().UTC()

	err := app.readJSON(nil, r, &newVenue)
	if err != nil {
		app.badReqestResponse(w, r, err)
		app.errorResponse(w, r, http.StatusBadRequest, err.Error())
	}

	err = app.venueModel.AddNewVenue(&newVenue)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	app.writeJSON(w, http.StatusOK, envelope{"venue": newVenue}, nil)
}

func (app *application) postCheckinHandler(w http.ResponseWriter, r *http.Request) {
	id, err := app.readIDParam(r)

	if err != nil {
		app.notFoundResponse(w, r)
		return
	}

	err = app.venueModel.InsertCheckin(id)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	count, err := app.venueModel.CountCheckins(id)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	app.writeJSON(w, http.StatusOK, envelope{"checkinCount": count}, nil)
	// w.WriteHeader(http.StatusNoContent)
}
