const express = require('express');

let { verifyToken, verifyAdminRole } = require('../middlewares/authentication')

let app = express();

let Category = require('../models/category')

// ====================
// Show all categories
// ==================== 
app.get('/category', verifyToken, (req, res) => {
    Category.find().sort('description').populate('user', 'name email').exec((err, categories) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        return res.json(categories);

    })
});

// ====================
// Show a category by ID
// ====================
app.get('/category/:id', verifyToken, (req, res) => {
    let id = req.params.id;

    Category.findById(id, (err, category) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json(category);

    })
});

// ====================
// Create a category
// ====================
app.post('/category', verifyToken, (req, res) => {

    // req.user._id

    let body = req.body;
    let userId = req.user._id
    let category = new Category({
        description: body.description,
        user: userId,
    });

    category.save((err, categoryDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            category: categoryDB
        })
    })
});

// ====================
// Update a category
// ====================
app.put('/category/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    let body = { description: req.body.description };

    Category.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, categoryBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            category: categoryBD
        });
    })
});

// ====================
// Delete a category
// ====================
app.delete('/category/:id', [verifyToken, verifyAdminRole], (req, res) => {
    // Only an administrator can delete a category
    let id = req.params.id;

    Category.findByIdAndDelete(id, (err, categoryDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            category: categoryDB
        })
    })
});


module.exports = app;