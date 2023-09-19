const express = require('express');
const path = require('path');
const app = express();
const dotenv = require('dotenv').config();
const axios = require('axios');
const bodyParser = require('body-parser');
const {FileController} = require('./controllers/FileController');
const cors = require("cors");

const SERVER_PORT = process.env.SERVER_PORT || 4000;

app.use(express.static(path.join(__dirname, '/public')));
app.use(cors());
app.use(bodyParser.urlencoded({ extended : false }));
app.use(bodyParser.json());

app.post('/api/store-file', FileController.store);

// const {FileManager} = require('./utils/fileManager');
// FileManager.storeFileFromURL("https://audius-discovery-18.cultur3stake.com/v1/tracks/kmbPZV1/stream?app_name=EXAMPLEAPP", "prueba2");

app.listen(SERVER_PORT, () => {console.log(`servidor corriendo en el puerto ${SERVER_PORT}`)});