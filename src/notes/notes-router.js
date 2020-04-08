const express = require("express");
// const uuid = require("uuid/v4");
//const logger = require("../logger");
const NotesService = require("./notes-service");
const jsonParser = express.json();
const notesRouter = express.Router();
const bodyParser = express.json();
const xss = require("xss");

notesRouter
    .route('/')
    // .get
    // .delete

notesRouter
    .route('/:id')
    // .get
    // .post
    // .delete

module.exports = notesRouter;