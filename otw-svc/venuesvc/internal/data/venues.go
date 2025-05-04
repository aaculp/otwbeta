package data

import "time"

type Venue struct {
	ID          int64     `json:"id"`
	CreatedAt   time.Time `json:"-"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	Addr        string    `json:"addr"`
	Tags        []string  `json:"tags"`
	Version     int32     `json:"version"`
}
