package main

import (
	"flag"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"time"
)

/*
GET /v1/healthCheck -- Get service info
GET /v1/venues/ venuesHandler -- Return all venues
GET /v1/veneus/:id venueHandler -- Return venue by ID
POST /v1/venues/:id createVenueHandler -- Create a new venue
PUT /v1/venues/:id editVenueHandler --  Update Details of a venue
DELETE /v1/venues/:id deleteVenueHandler -- Delete venue
GET /v1/venues/:range venuesInRangeHandler -- Return venues in range
*/

const version = "0.0.1"

type config struct {
	port int
	env  string
}

type application struct {
	config config
	logger *slog.Logger
}

func main() {
	var cfg config
	flag.IntVar(&cfg.port, "port", 4000, "API server port")
	flag.StringVar(&cfg.env, "env", "development", "Environment (development|staging|production)")
	flag.Parse()

	logger := slog.New(slog.NewTextHandler(os.Stdout, nil))
	app := &application{
		config: cfg,
		logger: logger,
	}

	srv := &http.Server{
		Addr:         fmt.Sprintf(":%d", cfg.port),
		Handler:      app.routes(),
		IdleTimeout:  time.Minute,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
		ErrorLog:     slog.NewLogLogger(logger.Handler(), slog.LevelError),
	}

	logger.Info("Starting server", "addr", srv.Addr, "env", cfg.env)

	err := srv.ListenAndServe()
	logger.Error(err.Error())
	os.Exit(1)
}
