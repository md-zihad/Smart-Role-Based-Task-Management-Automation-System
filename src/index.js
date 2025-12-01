const express = require('express');
require('dotenv').config();
const db = require('./config/db');
const exampleRoutes = require('./routes/example');
const setupSwagger = require('./config/swagger');
const userRoutes = require('./routes/users');

const app = express();
app.use(express.json());


app.use('/', exampleRoutes);
app.use('/', userRoutes);



setupSwagger(app); 

const PORT = process.env.PORT || 4000;

app.get('/', (req, res) => {
  res.json({ ok: true, message: 'Smart Task Backend — running' });
});


app.get('/health/db', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW() as now');
    res.json({ dbTime: result.rows[0].now });
  } catch (err) {
    console.error('DB health error:', err);
    res.status(500).json({ error: 'DB connection failed', detail: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});