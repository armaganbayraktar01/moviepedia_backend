// UserRouter
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

// Models
const UserSchema = require('../models/UserSchema');

// GET ALL
router.get('/', (req, res, next) => {

    promise.then((data) => {
        if (!data)
            next({ message: 'The data was not found.', code: 404 });

    res.json(data);
    }).catch((err) => {
        res.json(err);
    });
});

// GET ID
router.get('/:user_id', (req, res, next) => {

    promise.then((data) => {
        if (!data)
            next({ message: 'The data was not found.', code: 404 });

    const obj = Object.assign({}, ...data)
    //console.log(obj)
    res.json(obj);

    }).catch((err) => {
        res.json(err);
    });
});

// Put
router.put('/:user_id', (req, res, next) => {
    const promise = UserSchema.findByIdAndUpdate(
        req.params.user_id,
        req.body,
        {
            new: true
        }
    );

    promise.then((data) => {
        if (!data)
            next({ message: 'The data was not found.', code: 99 });

        res.json(data);
    }).catch((err) => {
        res.json(err);
    });
});


// POST
router.post('/', (req, res, next) => {
    const newData = new UserSchema(req.body);
    const promise = newData.save();

    promise.then((data) => {
        if (!data)
            next({ message: 'The data was not found.', code: 404 });

    res.json(data);
    }).catch((err) => {
        res.json(err);
    });
});


// Delete
router.delete('/:user_id', (req, res, next) => {
    const promise = UserSchema.findByIdAndRemove(req.params.user_id);

    promise.then((data) => {
        if (!data)
            next({ message: 'The movie was not found.', code: 99 });

        res.json({ status: 1 });
    }).catch((err) => {
        res.json(err);
    });
});


module.exports = router;
