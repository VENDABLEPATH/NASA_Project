const express = require('express');

const launchesRouter = express.Router();

const { getLaunches } = require('./launches.controller');

launchesRouter.get('/launches', getLaunches);

module.exports = launchesRouter;

