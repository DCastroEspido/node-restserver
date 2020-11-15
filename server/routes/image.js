const express = require('express');

let { verifyTokenImg } = require('../middlewares/authentication')

const fs = require('fs');
const path = require('path');

let app = express();

app.get('/image/:type/:img', verifyTokenImg, (req, res) => {
    let type = req.params.type;
    let img = req.params.img;

    let pathImg = path.resolve(__dirname, `../../uploads/${type}/${ img }`);
    console.log(pathImg);
    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {
        let noImagePath = path.resolve(__dirname, '../assets/no-image.jpg');
        res.sendFile(noImagePath);
    }
})


module.exports = app;