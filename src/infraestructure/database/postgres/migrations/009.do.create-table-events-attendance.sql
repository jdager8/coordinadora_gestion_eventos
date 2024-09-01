CREATE TABLE IF NOT EXISTS events_attendance (
  id SERIAL PRIMARY KEY NOT NULL,
  id_events_enrollments INTEGER,
  id_events_schedule INTEGER,
  created_by INTEGER,
  CONSTRAINT events_enrollments_fk FOREIGN KEY (id_events_enrollments) REFERENCES events_enrollments (id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT events_schedule_fk FOREIGN KEY (id_events_schedule) REFERENCES events_schedule (id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT created_by_fk FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT events_attendance_uq UNIQUE (id_events_enrollments, id_events_schedule)
);
