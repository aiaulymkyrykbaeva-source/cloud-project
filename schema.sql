-- Практика 6, вариант 7: Онлайн-обучение
CREATE TABLE IF NOT EXISTS courses (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  teacher VARCHAR(100),
  hours INTEGER
);

INSERT INTO courses(title, teacher, hours) VALUES
  ('JavaScript Basics', 'Aigul Nurpeisova', 40),
  ('Web Development', 'Daniyar Sarsenov', 60),
  ('Databases', 'Madina Omarova', 36);
