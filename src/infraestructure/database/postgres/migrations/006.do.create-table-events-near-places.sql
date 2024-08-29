CREATE TABLE IF NOT EXISTS events_near_places (
  id SERIAL PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  coordinates POINT,
  id_events INTEGER,
  CONSTRAINT events_fk FOREIGN KEY (id_events) REFERENCES events (id) ON DELETE CASCADE ON UPDATE CASCADE
);
