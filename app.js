const statisticsRouter = require('./routes/statistics');
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.static('build'));
app.use('/api/statistics', statisticsRouter);

app.get('/', (req, res) => {
  res.redirect('/api/statistics');
});

module.exports = app;
