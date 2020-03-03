DROP TABLE IF EXISTS recipes;

CREATE TABLE recipes (
  id SERIAL PRIMARY KEY,
  label VARCHAR(200),
  image_url TEXT,
  dietLabels TEXT,
  ingredientsLines TEXT
);
