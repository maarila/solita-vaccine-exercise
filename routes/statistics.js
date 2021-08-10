const statisticsRouter = require('express').Router();
const statisticsController = require('../controllers/statistics');

statisticsRouter.get('/', async (req, res) => {
  const defaultTime = ['2021-04-12T11:10:06.473587Z'];
  const summary = await statisticsController.getAll(defaultTime);
  res.json(summary);
});

statisticsRouter.get('/:timestamp', async (req, res) => {
  const summary = await statisticsController.getAll(req.params.timestamp);
  res.json(summary);
});

module.exports = statisticsRouter;
