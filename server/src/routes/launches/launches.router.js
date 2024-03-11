const express = require('express');

const launchesRouter = express.Router();

const { httpGetLaunches, httpSetLaunch, httpRemoveLaunch } = require('./launches.controller');

launchesRouter.get('/', httpGetLaunches);
launchesRouter.post('/', httpSetLaunch);
launchesRouter.delete('/:id', httpRemoveLaunch);

module.exports = launchesRouter;

