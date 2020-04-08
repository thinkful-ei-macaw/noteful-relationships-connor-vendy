const express = require("express");
// const uuid = require("uuid/v4");
//const logger = require("../logger");
const FoldersService = require("./folders-service");
const jsonParser = express.json();
const foldersRouter = express.Router();
const bodyParser = express.json();
const xss = require("xss");

foldersRouter
  .route("/")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    FoldersService.getAllFolders(knexInstance)
      .then((folders) => {
        res.json(folders);
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { folder_name } = req.body;
    const newFolder = { folder_name };
    const knexInstance = req.app.get("db");
    const requiredFields = { folder_name };
    // check for missing fields
    const missingFields = Object.entries(requiredFields)
    //item[0] is like key item[1] is like the value
      .filter((item) => item[1] === undefined)
      .map((item) => item[0]);//item[0], just takes the keys 
    if (missingFields.length > 0) {
      return res.status(400).send('These fields are missing: ' + missingFields.join());
    }
    FoldersService.insertFolder(knexInstance, newFolder)
      .then((folder) => {
        res.status(201).json(folder);
      })
      .catch(next);
  });

  foldersRouter
    .route('/:id')
    .get((req,res,next)=>{
      const folderId = req.params.id
      const knexInstance = req.app.get("db");
      FoldersService.getFolderById(knexInstance,folderId)
        .then(folder=>{
          res.json(folder);
        })
        .catch(next);
    })


module.exports = foldersRouter;
