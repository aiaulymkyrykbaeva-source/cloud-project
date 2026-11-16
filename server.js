const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Cloud project is running');
});

app.get('/info', (req, res) => {
  res.json({ status: 'ok', variant: process.env.STUDENT_VARIANT || 'not-set' });
});

// Нұсқа 7: Онлайн оқыту, нысан - Курс
app.get('/courses', (req, res) => {
  res.json([
    { id: 1, title: 'JavaScript Basics', teacher: 'Aigul Nurpeisova', hours: 40 },
    { id: 2, title: 'Web Development', teacher: 'Daniyar Sarsenov', hours: 60 },
    { id: 3, title: 'Databases', teacher: 'Madina Omarova', hours: 36 }
  ]);
});

app.listen(PORT, () => console.log(`Server started on ${PORT}`));
