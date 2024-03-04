const express = require('express');

const planetsRouter = express.Router();

const getPlanets = require('./planets.controller');

planetsRouter.get('/planets', getPlanets);

module.exports = planetsRouter;