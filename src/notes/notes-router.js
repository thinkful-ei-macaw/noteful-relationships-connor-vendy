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
    const {note_name, modified, folder_id, content } = req.body;
    const newNote = { note_name, modified, folder_id, content };
    const knexInstance = req.app.get("db");
    const requiredFields = { note_name, modified, folder_id, content };
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
            res.status(201).json(note);
          })
          .catch(next);
  })

notesRouter
  .route("/:id")
  .get((req, res, next) => {
    console.log('this is the notesrouter get request');
    const noteId = req.params.id;
    console.log(noteId)
    const knexInstance = req.app.get("db");
    NotesService.getNoteById(knexInstance, noteId)
      .then((note) => {
        res.json(note);
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    const { id } = req.params;
    const knexInstance = req.app.get("db");

    NotesService.getNoteById(knexInstance, id)
    //note is object with id, need to pass to the delete
      .then(note => {
        NotesService.deleteNote(knexInstance, note.id)
          .then(() => {
            res.status(204).end();
          })
          .catch(next);
      })
      .catch(next);
   
  });

module.exports = notesRouter;
