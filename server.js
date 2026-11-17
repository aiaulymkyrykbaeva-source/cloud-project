const express = require('express');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

// Строка подключения берётся ТОЛЬКО из переменной окружения DATABASE_URL.
// Её нельзя записывать в код и в репозиторий.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.use(express.json());

// ---- Маршруты практики 5 (оставлены без изменений) ----
app.get('/', (req, res) => {
  res.send('Cloud project is running');
});

app.get('/info', (req, res) => {
  res.json({ status: 'ok', variant: process.env.STUDENT_VARIANT || 'not-set' });
});

app.get('/courses', (req, res) => {
  res.json([
    { id: 1, title: 'JavaScript Basics', teacher: 'Aigul Nurpeisova', hours: 40 },
    { id: 2, title: 'Web Development', teacher: 'Daniyar Sarsenov', hours: 60 },
    { id: 3, title: 'Databases', teacher: 'Madina Omarova', hours: 36 }
  ]);
});

// ---- Практика 6. Вариант 7: Онлайн-обучение, ресурс /api/courses ----

// GET: все курсы
app.get('/api/courses', async (req, res) => {
  try {
    const r = await pool.query('SELECT * FROM courses ORDER BY id');
    res.json(r.rows);
  } catch (err) {
    console.error('DB error (GET /api/courses):', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET: один курс по id
app.get('/api/courses/:id', async (req, res) => {
  try {
    const r = await pool.query('SELECT * FROM courses WHERE id = $1', [req.params.id]);
    if (r.rows.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json(r.rows[0]);
  } catch (err) {
    console.error('DB error (GET /api/courses/:id):', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST: добавить курс
app.post('/api/courses', async (req, res) => {
  const { title, teacher, hours } = req.body || {};
  if (!title) {
    return res.status(400).json({ error: 'title is required' });
  }
  try {
    const r = await pool.query(
      'INSERT INTO courses(title, teacher, hours) VALUES($1, $2, $3) RETURNING *',
      [title, teacher || null, hours || null]
    );
    res.status(201).json(r.rows[0]);
  } catch (err) {
    console.error('DB error (POST /api/courses):', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

// При старте создаём таблицу (если её нет) и добавляем 3 начальные записи.
// Если подключение не удалось, сервер всё равно запускается, а причина видна в логе.
async function initDb() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS courses (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        teacher VARCHAR(100),
        hours INTEGER
      )
    `);
    const count = await pool.query('SELECT COUNT(*)::int AS n FROM courses');
    if (count.rows[0].n === 0) {
      await pool.query(`
        INSERT INTO courses(title, teacher, hours) VALUES
          ('JavaScript Basics', 'Aigul Nurpeisova', 40),
          ('Web Development', 'Daniyar Sarsenov', 60),
          ('Databases', 'Madina Omarova', 36)
      `);
    }
    console.log('Database ready');
  } catch (err) {
    console.error('DB init error:', err.message);
  }
}

app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
  initDb();
});
