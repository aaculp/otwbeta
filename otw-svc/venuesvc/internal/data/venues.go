package data

import (
	"database/sql"
	"errors"
	"time"

	"github.com/lib/pq"
)

type Venue struct {
	ID          int64     `json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	Addr        string    `json:"addr"`
	Tags        []string  `json:"tags"`
	Version     int32     `json:"version"`
	CreatedAt   time.Time `json:"-"`
}

type VenueModel struct {
	DB *sql.DB
}

var ErrRecordNotFound = errors.New("record not found")

func (m VenueModel) Get(id int64) (*Venue, error) {
	query := `
	SELECT id, created_at, name, description, addr, tags, version
	FROM venue_schema.venues
	WHERE id = $1`

	var v Venue
	var tags []string

	err := m.DB.QueryRow(query, id).Scan(
		&v.ID,
		&v.Name,
		&v.Description,
		&v.Addr,
		pq.Array(&tags),
		&v.Version,
		&v.CreatedAt,
	)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrRecordNotFound
		}
		return nil, err
	}

	v.Tags = tags
	return &v, nil
}

func (m VenueModel) GetAll() ([]Venue, error) {
	query := `
	SELECT id, created_at, name, description, addr, tags, version
	FROM venue_schema.venues
	ORDER BY id ASC`

	rows, err := m.DB.Query(query)

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var venues []Venue
	for rows.Next() {
		var v Venue
		var tags []string

		err := rows.Scan(
			&v.ID,
			&v.CreatedAt,
			&v.Name,
			&v.Description,
			&v.Addr,
			pq.Array(&tags),
			&v.Version,
		)

		if err != nil {
			return nil, err
		}

		v.Tags = tags
		venues = append(venues, v)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return venues, nil
}

func (m VenueModel) GetCheckins(venueID int64) (int, error) {
	query := `
		SELECT COUNT(*) FROM venue_schema.checkins WHERE venue_id = $1
	`

	var count int
	err := m.DB.QueryRow(query, venueID).Scan(&count)
	return count, err
}

func (m VenueModel) GetTotalCheckins() (int, error) {
	query := `SELECT COUNT(*) FROM venue_schema.checkins`

	var count int
	err := m.DB.QueryRow(query).Scan(&count)
	if err != nil {
		return 0, err
	}

	return count, nil
}

func (m VenueModel) AddNewVenue(v *Venue) error {
	query := `
		INSERT INTO venue_schema.venues (name, description, addr, tags, version, created_at)
		VALUES ($1, $2, $3, $4, $5, $6)
	`

	args := []any{v.Name, v.Description, v.Addr, pq.Array(v.Tags), v.Version, v.CreatedAt}
	_, err := m.DB.Exec(query, args...)
	return err
}

func (m VenueModel) InsertCheckin(venueID int64) error {
	query := `
		INSERT INTO venue_schema.checkins (venue_id)
		VALUES ($1)
	`

	_, err := m.DB.Exec(query, venueID)

	return err
}

func (m VenueModel) CountCheckins(venueID int64) (int, error) {
	query := `SELECT COUNT(*) FROM venue_schema.checkins WHERE venue_id = $1`

	var count int
	err := m.DB.QueryRow(query, venueID).Scan(&count)
	if err != nil {
		return 0, err
	}

	return count, nil
}
