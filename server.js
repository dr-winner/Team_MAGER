const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();
const dataRoutes = require('./routes/dataRoutes');

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Market Risk Analysis API is running!');
});
app.use('/api/data', dataRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
