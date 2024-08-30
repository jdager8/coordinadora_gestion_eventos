CREATE TABLE IF NOT EXISTS persons (
  id SERIAL PRIMARY KEY NOT NULL,
  firstname TEXT NOT NULL,
	lastname TEXT NOT NULL,
  email TEXT NOT NULL,
	id_number TEXT NOT NULL,
  CONSTRAINT persons_email_uq UNIQUE (email),
  CONSTRAINT persons_id_number_uq UNIQUE (id_number)
);
