package data

import (
	"database/sql"
	"errors"
	"time"

	"github.com/lib/pq"
)

type Venue struct {
	ID          int64     `json:"id"`
	CreatedAt   time.Time `json:"-"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	Addr        string    `json:"addr"`
	Tags        []string  `json:"tags"`
	Version     int32     `json:"version"`
}

type VenueModel struct {
	DB *sql.DB
}

var ErrRecordNotFound = errors.New("record not found")

func (m VenueModel) Get(id int64) (*Venue, error) {
	query := `
	SELECT id, created_at, name, description, addr, tags, version
	FROM venues
	WHERE id = $1`

	var v Venue
	var tags []string

	err := m.DB.QueryRow(query, id).Scan(
		&v.ID,
		&v.CreatedAt,
		&v.Name,
		&v.Description,
		&v.Addr,
		pq.Array(&tags),
		&v.Version,
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
