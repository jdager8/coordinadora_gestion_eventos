CREATE TABLE IF NOT EXISTS events_enrollments (
  id SERIAL PRIMARY KEY NOT NULL,
  id_events INTEGER,
  id_users INTEGER,
  CONSTRAINT events_fk FOREIGN KEY (id_events) REFERENCES events (id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT users_fk FOREIGN KEY (id_users) REFERENCES users (id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT event_user_uq UNIQUE (id_events, id_users)
);
