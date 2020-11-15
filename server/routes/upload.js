const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const User = require('../models/user')
const Product = require('../models/product')

const fs = require('fs');
const path = require('path');
const product = require('../models/product');

// default options
app.use(fileUpload());

app.put('/upload/:type/:id', function(req, res) {

    let type = req.params.type;
    let id = req.params.id;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No files were uploaded.'
            }
        });
    }

    // Type validation
    let allowedTypes = ['products', 'users'];
    if (allowedTypes.indexOf(type) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'The allowed types are ' + allowedTypes.join(', '),
            }
        });
    }

    let uploadedFile = req.files.uploadedFile;
    let fileNameSplited = uploadedFile.name.split('.');
    let extension = fileNameSplited[fileNameSplited.length - 1];


    // Allowed extensions
    let allowedExtensions = ['png', 'jpg', 'jpeg', 'gif', 'pdf'];

    if (allowedExtensions.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'The allowed extensions are ' + allowedExtensions.join(', '),
                ext: extension
            }
        });
    }

    // Rename the file
    let fileName = `${ id }-${ new Date().getMilliseconds()}.${ extension }`

    uploadedFile.mv(`./uploads/${type}/${fileName}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        switch (type) {
            case 'users':
                userImage(id, res, fileName);
                break;
            case 'products':
                productImage(id, res, fileName);
                break;
            default:
                console.log('Invalid type');
                break;
        }
    });

});

function userImage(id, res, fileName) {

    User.findById(id, (err, userDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!userDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'User not found'
                }
            });
        }

        deleteImage(userDB.img, 'users')

        userDB.img = fileName;
        userDB.save((err, userSaved) => {
            res.json({
                ok: true,
                user: userSaved,
                img: fileName
            })
        })
    })
}

function productImage(id, res, fileName) {
    Product.findById(id, (err, productDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Product not found'
                }
            });
        }

        deleteImage(productDB.img, 'products')

        productDB.img = fileName;
        productDB.save((err, productSaved) => {
            res.json({
                ok: true,
                product: productSaved,
                img: fileName
            })
        })
    })
}

function deleteImage(fileName, type) {
    let pathFile = path.resolve(__dirname, `../../uploads/${type}/${ fileName }`)
    if (fs.existsSync(pathFile)) {
        fs.unlinkSync(pathFile);
    }
}


module.exports = app;