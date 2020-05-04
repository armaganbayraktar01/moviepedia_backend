// PersonRouter
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

// Models
const PersonSchema = require('../models/PersonSchema');

// GET ALL
router.get('/', (req, res, next) => {
    const promise = PersonSchema.aggregate([
        {
            $lookup: {
                from: 'movies',
                localField: '_id', // persons collection altındaki _id 
                foreignField: 'director',// movies collection altındaki director
                as: 'directedMovies'
            }
        },
        { 
            $unwind: { 
                path: '$directedMovies',
                preserveNullAndEmptyArrays: true // eşleşme olmayan dataları da çektik
            }
        },

        {
            $lookup: {
                from: 'movies',
                localField: '_id', // persons collection altındaki _id 
                foreignField: 'cast',// movies collection altındaki director
                as: 'filmography'
            }
        },
        { 
            $unwind: 
            { 
                path: '$filmography',
                preserveNullAndEmptyArrays: true // eşleşme olmayan dataları da çektik
            }
        },
        {
            $group: 
            {
                _id: {
                    _id: '$_id',
                    fullname: '$fullname',
                    bio: '$bio',
                    imbd_id: '$imbd_id',
                    birth: '$birth',
                    cover: '$cover',
                    createdAt: '$createdAt'
                },
                directedMovies: {
                    $push: '$directedMovies'
                },
                filmography: {
                    $push: '$filmography'
                }
            }
        },

        {
            $project: {
                _id: '$_id._id',
                imbd_id: '$_id.imbd_id',
                fullname: '$_id.fullname',
                bio: '$_id.bio',
                cover: '$_id.cover',
                birth: '$_id.birth',
                createdAt: '$_id.createdAt',
                filmography: '$filmography',
                directedMovies: '$directedMovies'
            }
        }

    ]);

    promise.then((data) => {
        if (!data)
            next({ message: 'The data was not found.', code: 404 });

    res.json(data);
    }).catch((err) => {
        res.json(err);
    });
});

// GET ID
router.get('/:person_id', (req, res, next) => {
    const promise = PersonSchema.aggregate([
        {
            $match: {
                '_id': mongoose.Types.ObjectId(req.params.person_id)
            } 
        },
        // Directed Movie
        {
            $lookup: {
                from: 'movies',
                localField: '_id', // persons collection altındaki _id 
                foreignField: 'director',// movies collection altındaki director
                as: 'directedMovies'
            }
        },
        { 
            $unwind: { 
                path: '$directedMovies',
                preserveNullAndEmptyArrays: true // eşleşme olmayan dataları da çektik
            }
        },
        // Filmography
        {
            $lookup: {
                from: 'movies',
                localField: '_id', // persons collection altındaki _id 
                foreignField: 'cast',// movies collection altındaki director
                as: 'filmography'
            }
        },
        { 
            $unwind: 
            { 
                path: '$filmography',
                preserveNullAndEmptyArrays: true // eşleşme olmayan dataları da çektik
            }
        },

        {
            $group: 
            {
                _id: {
                    _id: '$_id',
                    fullname: '$fullname',
                    bio: '$bio',
                    imbd_id: '$imbd_id',
                    cover: '$cover',
                    birth: '$birth',
                    createdAt: '$createdAt'
                },
                directedMovies: {
                    $push: '$directedMovies'
                },
                filmography: {
                    $push: '$filmography'
                }
            }
        },

        {
            $project: {
                _id: '$_id._id',
                imbd_id: '$_id.imbd_id',
                fullname: '$_id.fullname',
                bio: '$_id.bio',
                cover: '$_id.cover',
                birth: '$_id.birth',
                createdAt: '$_id.createdAt',
                filmography: '$filmography',
                directedMovies: '$directedMovies'
            }
        }

    ]);

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
router.put('/:person_id', (req, res, next) => {
    const promise = PersonSchema.findByIdAndUpdate(
        req.params.person_id,
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
    const newData = new PersonSchema(req.body);
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
router.delete('/:person_id', (req, res, next) => {
    const promise = PersonSchema.findByIdAndRemove(req.params.person_id);

    promise.then((data) => {
        if (!data)
            next({ message: 'The movie was not found.', code: 99 });

        res.json({ status: 1 });
    }).catch((err) => {
        res.json(err);
    });
});


module.exports = router;
