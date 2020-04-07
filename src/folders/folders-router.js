const express = require("express");
// const uuid = require("uuid/v4");
//const logger = require("../logger");
const FoldersService = require("./folders-service");
const jsonParser = express.json();
const foldersRouter = express.Router();
const bodyParser = express.json();
const xss = require("xss");

foldersRouter
  .route('/folders')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    FoldersService.getAllFolders(knexInstance)
      .then((folders) => {
        res.json(folders);
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { name } = req.body;
    const newFolder = { name };
    const requiredFields = { name };
    // check for missing fields
    const missingFields = Object.entries(requiredFields)
      .filter((items) => items[1] === undefined)
      .map((item) => item[0]);
    if (missingFields.length > 0) {
      res.status(400).send(missingFields.join)
    }
  })