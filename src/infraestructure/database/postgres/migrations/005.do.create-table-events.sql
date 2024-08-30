CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  capacity INTEGER NOT NULL,
  registered_count INTEGER NOT NULL DEFAULT 0,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  id_events_types INTEGER NOT NULL,
  created_by INTEGER NOT NULL,
  CONSTRAINT events_types_fk FOREIGN KEY (id_events_types) REFERENCES events_types (id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT created_by_fk FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE RESTRICT ON UPDATE CASCADE
);
