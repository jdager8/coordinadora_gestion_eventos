CREATE TABLE IF NOT EXISTS events_schedule (
  id SERIAL PRIMARY KEY NOT NULL,
  date DATE NOT NULL,
  id_events INTEGER,
  CONSTRAINT events_fk FOREIGN KEY (id_events) REFERENCES events (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT date_event_uq UNIQUE (date, id_events)
);
