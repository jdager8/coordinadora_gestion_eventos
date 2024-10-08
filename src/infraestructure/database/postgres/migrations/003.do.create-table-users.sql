CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY NOT NULL,
  username TEXT NOT NULL,
	password TEXT NOT NULL,
	created_at DATE NOT NULL DEFAULT CURRENT_DATE,
	id_persons INTEGER NOT NULL,
	id_roles INTEGER NOT NULL,
  CONSTRAINT persons_fk FOREIGN KEY (id_persons) REFERENCES persons (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT roles_fk FOREIGN KEY (id_roles) REFERENCES roles (id) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT users_uq UNIQUE (id_persons),
  CONSTRAINT users_username_uq UNIQUE (username)
);
