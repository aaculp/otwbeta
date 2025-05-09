package main

import (
	"flag"
	"fmt"
	"log"
	"log/slog"
	"net/http"
	"os"
	"time"

	"github.com/joho/godotenv"
	"venuesvc.otw.net/internal/data"
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
	config     config
	logger     *slog.Logger
	venueModel data.VenueModel
}

func main() {
	dbErr := godotenv.Load()
	if dbErr != nil {
		log.Fatal("Error loading .env file")
	}

	var cfg config
	flag.IntVar(&cfg.port, "port", 4000, "API server port")
	flag.StringVar(&cfg.env, "env", "development", "Environment (development|staging|production)")
	flag.Parse()

	logger := slog.New(slog.NewTextHandler(os.Stdout, nil))
	db, err := openDB()
	if err != nil {
		logger.Error("unable to connect to DB", "error", err)
		os.Exit(1)
	}
	defer db.Close()

	app := &application{
		config:     cfg,
		logger:     logger,
		venueModel: data.VenueModel{DB: db},
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

	errSrv := srv.ListenAndServe()
	logger.Error(errSrv.Error())
	os.Exit(1)
}
