const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

// Models
const MovieSchema = require('../models/MovieSchema');

// Get top10 film
router.get('/top10', (req, res, next) => {
	const promise = MovieSchema.find({ }).limit(10).sort({ imbd_rating: -1 }); // sort A-Z && 1=9 => 1, Z-A && 9=1 -1

	promise.then((data) => {
		//console.log(data);
		res.json(data);

	}).catch((err) => {
		res.json(err);
	});
});

// Get top100 film
router.get('/top100', (req, res, next) => {
	const promise = MovieSchema.find({ }).limit(100).sort({ imbd_rating: -1 });

	promise.then((data) => {
		//console.log(data);
		res.json(data);

	}).catch((err) => {
		res.json(err);
	});
});

// Get all
router.get('/', (req, res) => {
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

		// genres
		{
			$lookup: {
				from: 'genres',
				localField: 'genres',
				foreignField: '_id',
				as: 'genres'
			}
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


	]);

	promise.then((data) => {
		res.json(data);
	}).catch((err) => {
		res.json(err);
	})
});

// Get id
router.get('/:movie_id', (req, res) => {
	const promise = MovieSchema.aggregate([
		{
			$match: {
				'_id': mongoose.Types.ObjectId(req.params.movie_id)
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
		// genres
		{
			$lookup: {
				from: 'genres',
				localField: 'genres',
				foreignField: '_id',
				as: 'genres'
			}
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
	]);

	promise.then((data) => {
		res.json(data);
	}).catch((err) => {
		res.json(err);
	})
});

/**
	// Get findById
	router.get('/:movie_id', (req, res, next) => {
		const promise = MovieSchema.findById(req.params.movie_id);

		promise.then((movie) => {
			if (!movie)
				next({ message: 'The movie was not found.', code: 99 });

			res.json(movie);
		}).catch((err) => {
			res.json(err);
		});
	});
*/

// Put
router.put('/:movie_id', (req, res, next) => {
	const promise = MovieSchema.findByIdAndUpdate(
		req.params.movie_id,
		req.body,
		{
			new: true
		}
	);

	promise.then((movie) => {
		if (!movie)
			next({ message: 'The movie was not found.', code: 99 });

		res.json(movie);
	}).catch((err) => {
		res.json(err);
	});
});

// Post
router.post('/', (req, res, next) => {
	const newMovie = new MovieSchema(req.body);
	const promise = newMovie.save();
	
	promise.then((data) => {
		//console.log(data);
		res.json(data);

	}).catch((err) => {
		res.json(err);
	});

});

// Delete
router.delete('/:movie_id', (req, res, next) => {
	const promise = MovieSchema.findByIdAndRemove(req.params.movie_id);

	promise.then((movie) => {
		if (!movie)
			next({ message: 'The movie was not found.', code: 99 });

		res.json({ status: 1 });
	}).catch((err) => {
		res.json(err);
	});
});

// Between
router.get('/between/:start_year/:end_year', (req, res) => {
	const { start_year, end_year } = req.params;
	const promise = MovieSchema.find(
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