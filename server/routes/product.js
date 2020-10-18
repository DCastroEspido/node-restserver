const express = require('express');
let { verifyToken } = require('../middlewares/authentication');

let app = express();
let Product = require('../models/product')

// ====================
// Show all products
// ==================== 
app.get('/product', (req, res) => {
    // Traer todos los productos
    // populate: usuario categoría
    // Paginado
    let queryStatus = { available: true };
    let from = Number(req.query.from || 0);
    let limit = Number(req.query.limit || 5);
    Product.find(queryStatus).skip(from)
        .limit(limit).sort('name').populate('category', 'description').skip(from).limit(limit).populate('user', 'name email').exec((err, products) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            return res.json(products);

        })
})

// ====================
// Show a product by id
// ==================== 
app.get('/product/:id', verifyToken, (req, res) => {
    // populate: usuario categoría
    let id = req.params.id;

    Product.findById(id).populate('category', 'description').populate('user', 'name email').exec((err, product) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json(product);

    })
})

// ====================
// Show a product by keyword
// ==================== 
app.get('/product/search/:keyword', verifyToken, (req, res) => {
    // populate: usuario categoría
    let keyword = req.params.keyword;
    let regEx = new RegExp(keyword, 'i');

    Product.find({ name: regEx }).populate('category', 'description').exec((err, products) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json(products);

    })
})

// ====================
// Create a product
// ==================== 
app.post('/product', verifyToken, (req, res) => {
    // Guardar el usuario
    // Guardar una categoría del listado
    let body = req.body;
    let userId = req.user._id
    let productCreate = new Product({
        name: body.name,
        description: body.description,
        prizeUnit: body.prizeUnit,
        category: body.categoryId,
        user: userId,
    });

    productCreate.save((err, productDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            product: productDB
        })
    })
})

// ====================
// Update a product by id
// ==================== 
app.put('/product/:id', verifyToken, (req, res) => {
    // Guardar el usuario
    // Guardar una categoría del listado
    let id = req.params.id;
    let body = req.body;

    Product.findById(id, (err, productDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!productDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'the product with ID ' + id + ' could not be found'
                }
            });
        }

        productDB.name = body.name != null ? body.name : productDB.name;
        productDB.description = body.description != null ? body.description : productDB.description;
        productDB.prizeUnit = body.prizeUnit != null ? body.prizeUnit : productDB.prizeUnit;
        productDB.available = body.available != null ? body.available : productDB.available;
        productDB.category = body.category != null ? body.category : productDB.category;

        productDB.save((err, productSaved) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                product: productSaved
            })
        })


    })
})

// ====================
// Delete a product by id
// ==================== 
app.delete('/product/:id', verifyToken, (req, res) => {
    // Borrado lógico, deja de estar disponible
    let id = req.params.id;
    let productDelted = {
        available: false,
    }
    console.log('deleting product...');

    Product.findByIdAndUpdate(id, productDelted, { new: true, runValidators: true, context: 'query' }, (err, productDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            product: productDB
        });
    })
})

module.exports = app;