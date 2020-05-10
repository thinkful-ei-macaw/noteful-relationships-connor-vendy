const express = require("express");
// const uuid = require("uuid/v4");
//const logger = require("../logger");
const FoldersService = require("./folders-service");
const jsonParser = express.json();
const foldersRouter = express.Router();
// const bodyParser = express.json();
// const xss = require("xss");

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
    const { name } = req.body;
    const newFolder = { name };
    const knexInstance = req.app.get("db");
    const requiredFields = { name };
    // check for missing fields
    const missingFields = Object.entries(requiredFields)
    // item[0] is like key item[1] is like the value
      .filter((item) => item[1] === undefined)
      .map((item) => item[0]);//item[0], just takes the keys 
    if (missingFields.length > 0) {
      return res.status(400).send('These fields are missing: ' + missingFields.join());
    }
    FoldersService.insertFolder(knexInstance, newFolder)
      .then((folder) => {
        res.status(201).location(`/folders/${folder.id}`).json(folder);
      })
      .catch(next);
  });

  foldersRouter
  .route("/:folder_id")
  .all((req, res, next) => {
    FoldersService.getById(req.app.get("db"), req.params.folder_id)
      .then((folder) => {
        if (!folder) {
          return res.status(404).json({
            error: { message: "folder doesn't exist" },
          });
        }
        res.folder = folder;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(res.folder);
  })
  .delete((req, res, next) => {
    FoldersService.deleteFolder(req.app.get("db"), req.params.folder_id)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
    })


module.exports = foldersRouter;
