const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

// Models
const GenreSchema = require('../models/GenreSchema');
const MovieSchema = require('../models/MovieSchema');

// Get text name
router.get('/filter/:genre_name', (req, res) => {
	const { genre_name } = req.params;
	const promise = MovieSchema.aggregate([
		// director sorgusu
		{
			$lookup: {
				from: 'persons',
				localField: 'director',
				foreignField: '_id',
				as: 'director'
			}
		},
		{
			$unwind: '$director'
		},
		// genres
		{
			$lookup: {
				from: 'genres',
				localField: 'genres',
				foreignField: '_id',
				as: 'genres'
			}
		},
		{
			$unwind: '$genres'
		},
		// cast sorgusu
		{
			$lookup: {
				from: 'persons',
				localField: 'cast',
				foreignField: '_id',
				as: 'cast'
			}
		},
		{
			$unwind: '$cast'
		},	
		// match işlemi genres.text unwind edilen genresten geliyor
		{
			$match: {
				
				"genres.text" : genre_name
			}
		},
		{
            $group: 
            {
                _id: {
                    _id: '$_id',
                    title: '$title',
                    titleTr: '$titleTr',
                    imbd_id:'$imbd_id',
                    genres:'$genres',
                    relase_year:'$relase_year',
                    imbd_rating:'$imbd_rating',
                    duration:'$duration',
                    director:'$director',
                    cover:'$cover',
                    createdAt:'$createdAt',
                 },
                cast: {
                    $push: '$cast'
                }
            }
        },
        {
            $project: {
                _id: '$_id._id',
                title: '$_id.title',
                titleTr: '$_id.titleTr',
                imbd_id:'$_id.imbd_id',
                //genres:'$_id.genres',
                relase_year:'$_id.relase_year',
                imbd_rating:'$_id.imbd_rating',
                //duration:'$_id.duration',
                //director:'$_id.director',
                cover:'$_id.cover',
                createdAt:'$_id.createdAt',
                //cast: '$cast',
            }
        }
	]);

	promise.then((data) => {
		res.json(data);
	}).catch((err) => {
		res.json(err);
	})
});

// Get all
router.get('/', (req, res) => {
	const promise = GenreSchema.aggregate([
		// director sorgusu
		{
			$lookup: {
				from: 'persons',
				localField: 'director',
				foreignField: '_id',
				as: 'director'
			}
		},
		{
			$unwind: '$director'
		},
		// genres
		{
			$lookup: {
				from: 'genres',
				localField: 'genres',
				foreignField: '_id',
				as: 'genres'
			}
		},
		{
			$unwind: '$genres'
		},
		// cast sorgusu
		{
			$lookup: {
				from: 'persons',
				localField: 'cast',
				foreignField: '_id',
				as: 'cast'
			}
		},
		{
			$unwind: '$cast'
		},
	    {
            $group: 
            {
                _id: {
                    _id: '$_id',
                    title: '$title',
                    titleTr: '$titleTr',
                    imbd_id:'$imbd_id',
                    genres:'$genres',
                    relase_year:'$relase_year',
                    imbd_rating:'$imbd_rating',
                    duration:'$duration',
                    director:'$director',
                    cover:'$cover',
					createdAt:'$createdAt',
                 },
                cast: {
                    $push: '$cast'
                }
            }
        },
                {
            $project: {
                _id: '$_id._id',
                title: '$_id.title',
                titleTr: '$_id.titleTr',
                imbd_id:'$_id.imbd_id',
                genres:'$_id.genres',
                relase_year:'$_id.relase_year',
                imbd_rating:'$_id.imbd_rating',
                duration:'$_id.duration',
                director:'$_id.director',
                cover:'$_id.cover',
                createdAt: '$_id.createdAt',
                cast: '$cast',
            }
        }
	]);

	promise.then((data) => {
		res.json(data);
	}).catch((err) => {
		res.json(err);
	})
});

// Put
router.put('/:genre_id', (req, res, next) => {
	const promise = GenreSchema.findByIdAndUpdate(
		req.params.genre_id,
		req.body,
		{
			new: true
		}
	);

	promise.then((text) => {
		if (!text)
			next({ message: 'The genre was not found.', code: 99 });

		res.json(text);
	}).catch((err) => {
		res.json(err);
	});
});

// Post
router.post('/', (req, res, next) => {
	const id = new mongoose.Types.ObjectId();

	const newGenre = new GenreSchema({
		_id: req.body.value !== "" ? req.body.value : id,
		value: req.body.value !== "" ? req.body.value : id,
		text: req.body.text
	});

	const promise = newGenre.save();
	
	promise.then((data) => {
		// console.log(data);
		res.json(data);

	}).catch((err) => {
		res.json(err);
	});

});

// Delete
router.delete('/:genre_id', (req, res, next) => {
	const promise = GenreSchema.findByIdAndRemove(req.params.genre_id);

	promise.then((text) => {
		if (!text)
			next({ message: 'The genre was not found.', code: 99 });

		res.json({ status: 1 });
	}).catch((err) => {
		res.json(err);
	});
});


module.exports = router;