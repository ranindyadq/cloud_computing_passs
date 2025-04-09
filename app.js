const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { connectDB, client } = require('./db');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

// Route: Form input
app.get('/', (req, res) => {
  res.render('index');
});

// Route: Simpan data
app.post('/submit', async (req, res) => {
  try {
    const db = client.db('azure-paas2-node');
    const collection = db.collection('users');
    await collection.insertOne(req.body);
    res.redirect('/data');
  } catch (err) {
    console.error(err);
    res.status(500).send('Gagal menyimpan data');
  }
});

// Route: Tampilkan data
app.get('/data', async (req, res) => {
  try {
    const db = client.db('azure-paas2-node');
    const collection = db.collection('users');
    const rows = await collection.find().toArray();
    res.render('data', { rows });
  } catch (err) {
    console.error(err);
    res.status(500).send('Gagal mengambil data');
  }
});

// Jalankan server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
