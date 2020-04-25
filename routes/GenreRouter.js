const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

// Models
const GenreSchema = require('../models/GenreSchema');

// Get top10 film
router.get('/top10', (req, res, next) => {
	const promise = GenreSchema.find({ }).limit(10).sort({ imbd_rating: -1 }); // sort A-Z && 1=9 => 1, Z-A && 9=1 -1

	promise.then((data) => {
		//console.log(data);
		res.json(data);

	}).catch((err) => {
		res.json(err);
	});
});

// Get top100 film
router.get('/top100', (req, res, next) => {
	const promise = GenreSchema.find({ }).limit(100).sort({ imbd_rating: -1 });

	promise.then((data) => {
		//console.log(data);
		res.json(data);

	}).catch((err) => {
		res.json(err);
	});
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
                createdAt:'$_id.createdAt',
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

// Get id
router.get('/:genre_id', (req, res) => {
	const promise = GenreSchema.aggregate([
		{
			$match: {
				'_id': mongoose.Types.ObjectId(req.params.genre_id)
			} 
		},
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
                createdAt:'$_id.createdAt',
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

/**
	// Get findById
	router.get('/:genre_id', (req, res, next) => {
		const promise = GenreSchema.findById(req.params.genre_id);

		promise.then((genre) => {
			if (!genre)
				next({ message: 'The genre was not found.', code: 99 });

			res.json(genre);
		}).catch((err) => {
			res.json(err);
		});
	});
*/

// Put
router.put('/:genre_id', (req, res, next) => {
	const promise = GenreSchema.findByIdAndUpdate(
		req.params.genre_id,
		req.body,
		{
			new: true
		}
	);

	promise.then((genre) => {
		if (!genre)
			next({ message: 'The genre was not found.', code: 99 });

		res.json(genre);
	}).catch((err) => {
		res.json(err);
	});
});

// Post
router.post('/', (req, res, next) => {
	const newGenre = new GenreSchema(req.body);
	const promise = newGenre.save();
	
	promise.then((data) => {
		//console.log(data);
		res.json(data);

	}).catch((err) => {
		res.json(err);
	});

});

// Delete
router.delete('/:genre_id', (req, res, next) => {
	const promise = GenreSchema.findByIdAndRemove(req.params.genre_id);

	promise.then((genre) => {
		if (!genre)
			next({ message: 'The genre was not found.', code: 99 });

		res.json({ status: 1 });
	}).catch((err) => {
		res.json(err);
	});
});

// Between
router.get('/between/:start_year/:end_year', (req, res) => {
	const { start_year, end_year } = req.params;
	const promise = GenreSchema.find(
		{
			// gt büyük, gte büyük ve eşit / lt küçük, lte küçük ve eşit  parseınT DB DEN GELEN STRİNG DATAYI INTEGERE PARSE EDER
			relase_year: { "$gte": parseInt(start_year), "$lte": parseInt(end_year) }
		}
	);

	promise.then((data) => {
		res.json(data);
	}).catch((err) => {
		res.json(err);
	})
});

module.exports = router;