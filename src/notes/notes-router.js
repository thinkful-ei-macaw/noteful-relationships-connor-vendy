const express = require("express");
const NotesService = require("./notes-service");
const jsonParser = express.json();
const notesRouter = express.Router();
// const xss = require("xss");

notesRouter
  .route("/")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    NotesService.getAllNotes(knexInstance)
      .then((notes) => {
        res.json(notes);
      })
      .catch(next);
  })
  .post(jsonParser, (req,res,next) => {
    const { name, folderId: folder_id, modified, content } = req.body;
    const newNote = { name, folder_id, modified, content };
    const knexInstance = req.app.get("db");
    const requiredFields = { name, folder_id, modified, content };
        // check for missing fields
        const missingFields = Object.entries(requiredFields)
        //item[0] is like key item[1] is like the value
          .filter((item) => item[1] === undefined)
          .map((item) => item[0]);//item[0], just takes the keys 
        if (missingFields.length > 0) {
          return res.status(400).send('These fields are missing: ' + missingFields.join());
        }
        NotesService.insertNote(knexInstance, newNote)
          .then((note) => {
            res.status(201).location(`/notes/${note.id}`).json(note);
          })
          .catch(next);
  })

notesRouter
  .route("/:note_id")
  .all((req, res, next) => {
    NotesService
      .getById(req.app.get("db"), req.params.note_id)
      .then((note) => {
        if (!note) {
          return res.status(404).json({
            error: { message: "note does not exist" },
          });
        }
        res.note = note;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(res.note);
  })
  .delete((req, res, next) => {
    NotesService
      .deletenote(req.app.get("db"), req.params.note_id)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
   
  });

module.exports = notesRouter;
