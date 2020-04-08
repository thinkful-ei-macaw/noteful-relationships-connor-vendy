require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require('./config')
const app = express();
const folderRouter = require('./folders/folders-router');
const noteRouter = require('./notes/notes-router');
const morganOption = NODE_ENV === "production" ? "tiny" : "common";

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello, world!");
});
//write an express server with endpoints folders and notes
app.use('/folders', folderRouter); 
app.use('/notes', noteRouter); 

app.use((error, req, res, next) => {//eslint-disable-line no-unused-vars
  let message;
  if (NODE_ENV === "production") {
    message = { error: { message: "server error" } };
  } else {
    console.error(error);
    message = { message: error.message, error }
  }
  res.status(500).json(message);
});

module.exports = app;
