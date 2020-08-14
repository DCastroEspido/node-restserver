const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const User = require('../models/user')
const app = express();

app.get('/usuario', function(req, res) {
    let queryStatus = { status: true };
    let from = Number(req.query.from || 0);
    let limit = Number(req.query.limit || 5);
    User.find(queryStatus, 'name email role status google img')
        .skip(from)
        .limit(limit)
        .exec((err, users) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            User.count(queryStatus, (err, numElements) => {
                res.json({
                    ok: true,
                    numElements,
                    users
                })
            })

        });

});
app.post('/usuario', function(req, res) {

    let body = req.body;

    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    user.save((err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            user: userDB
        })
    })
});

app.put('/usuario/:id', function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'email', 'img', 'role', 'status']);
    User.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            user: userDB
        });
    })

});

app.delete('/usuario/:id', function(req, res) {
    let id = req.params.id;
    let userDelete = { status: false };
    User.findByIdAndUpdate(id, userDelete, { new: true }, (err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (userDB == null) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            user: userDB
        });
    })
});

module.exports = app;