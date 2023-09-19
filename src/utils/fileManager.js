const fs = require("fs");
const path = require('path');
const axios = require('axios');
//const { rejects } = require("assert");
const dotevn = require('dotenv').config();

const STORAGE_DIRECTORY_PATH = process.env.STORAGE_DIRECTORY_PATH;

const FileManager = {};

FileManager.storeFileFromURL = async (URL, filename) => {

    return new Promise(async (resolve, reject) => {
        let filePath = path.join(process.cwd(), STORAGE_DIRECTORY_PATH);
        if (!fs.existsSync(filePath)) fs.mkdirSync(filePath);

        const response = await axios.get(URL, { responseType: 'stream' })

        const filetype = resolveFileTypeFromResponse(response);
        filePath = path.join(process.cwd(), STORAGE_DIRECTORY_PATH, `${filename}.${filetype}`);

        const fileStream = fs.createWriteStream(filePath);

        fileStream.on('error', error => {
            reject(error); // Rechaza la promesa en caso de error de escritura
        });

        fileStream.on('finish', () => {
            resolve({filename : filename, filetype: filetype}); // Resuelve la promesa cuando la escritura se completa con éxito
        });

        response.data.pipe(fileStream);
    }
    );
}

function resolveFileTypeFromResponse(response){
    try {
        const contentType = response.headers['content-type'];
        let filetype = 'bin';
        if(contentType) filetype = contentType.split('/')[1];
        return filetype;
    } catch (error) {
        return error;
    }
}

module.exports = {FileManager};