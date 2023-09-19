const {FileManager} = require('../utils/fileManager')
const FileController = {};

FileController.store = async (req, res) => {
    try {
        const url = req.body.url;
        let nowtime = new Date();
        const name = `${nowtime.valueOf()}`;
        const filedata  = await FileManager.storeFileFromURL(url, name);
        res.status(200).send(filedata);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

module.exports = {FileController};