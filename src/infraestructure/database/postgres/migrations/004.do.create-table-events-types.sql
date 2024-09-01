CREATE TABLE IF NOT EXISTS events_types (
  id SERIAL PRIMARY KEY NOT NULL,
  type TEXT NOT NULL,
  CONSTRAINT events_types_type_uq UNIQUE (type)
);
