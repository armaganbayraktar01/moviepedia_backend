const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();


// Models
const MovieSchema = require('../models/MovieSchema');

// Get all Son eklenenler
router.get('/', (req, res) => {
	const promise = MovieSchema.aggregate([
		{
			$sort: {
				createdAt: 1
			}
		},
		{ 
            "$lookup" : { 
                "from" : "persons", 
                "localField" : "director", 
                "foreignField" : "_id", 
                "as" : "director"
            }
        }, 
        { 
            "$lookup" : { 
                "from" : "genres", 
                "localField" : "genres", 
                "foreignField" : "_id", 
                "as" : "genres"
            }
        }, 
        { 
            "$lookup" : { 
                "from" : "persons", 
                "localField" : "cast", 
                "foreignField" : "_id", 
                "as" : "cast"
            }
        }, 
        { 
            "$unwind" : { 
                "path" : "$cast", 
                "preserveNullAndEmptyArrays" : true
            }
        }, 
        { 
            "$group" : { 
                "_id" : { 
                    "_id" : "$_id", 
                    "title" : "$title", 
                    "titleTr" : "$titleTr", 
                    "imbd_id" : "$imbd_id", 
                    "genres" : "$genres",
                    "synopsis" : "$synopsis",
                    "relase_year" : "$relase_year", 
                    "imbd_rating" : "$imbd_rating", 
                    "duration" : "$duration", 
                    "director" : "$director", 
                    "cover" : "$cover", 
                    "images" : "$images",
                    "videos" : "$videos",
                    "countries" : "$countries",
                    "createdAt" : "$createdAt"
                }, 
                "cast" : { 
                    "$push" : "$cast"
                }
            }
        }, 
        { 
            "$project" : { 
                "_id" : "$_id._id", 
                "title" : "$_id.title", 
                "titleTr" : "$_id.titleTr", 
                "imbd_id" : "$_id.imbd_id", 
                "genres" : "$_id.genres", 
                "relase_year" : "$_id.relase_year", 
                "imbd_rating" : "$_id.imbd_rating", 
                "duration" : "$_id.duration",
                "synopsis" : "$_id.synopsis",
                "director" : "$_id.director", 
                "cover" : "$_id.cover",
                "images" : "$_id.images",
                "videos" : "$_id.videos",
                "countries" : "$_id.countries",
                "createdAt" : "$_id.createdAt", 
                "cast" : "$cast"
            }
        }
	]);

	promise.then((data) => {
		res.json(data);
	}).catch((err) => {
		res.json(err);
	})
});

// Film Robot - relase date start year - end year
router.get('/filmrobot/genre=:genre_name?&imbd=:imbd?&relase=:start_year-:end_year&sort=:sort_val?&limit=:limit?',(req, res) => {	

	const { genre_name, imbd, sort_val, limit, start_year, end_year } = req.params;
	
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
		// match işlemi genres.genre unwind edilen genresten geliyor
		{
			$match: {	

				"genres.label" : genre_name ? genre_name : { 
					$in: ['crime', 'comedy', 'horror', 'war', 'action', 'drama', 'history']
				},
				"imbd_rating" : imbd == undefined ? { "$gte" : "1" } : { "$gte" : imbd },
				"relase_year": { "$gte": parseInt(start_year), "$lte": parseInt(end_year) },
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
                    genres:'$genres.genres',
                    relase_year:'$relase_year',
                    imbd_rating:'$imbd_rating',
                    duration:'$duration',
                    director:'$director',
                    cover:'$cover',
                    images : "$images",
                    videos : "$videos",
                    countries : "$countries",
                    createdAt:'$createdAt',
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
                //images : "$_id.images",
                //videos : "$_id.videos",
                //countries : "$_id.countries",
                createdAt:'$_id.createdAt',
                //cast: '$cast',
            }
		},
		{ 
			$sort: 
			{ 
				imbd_rating: parseInt(sort_val ? sort_val : -1 )
			} 
		},
		{ $limit : parseInt(limit ? limit : 10 ) },
	]);

	promise.then((data) => {
		res.json(data);
	}).catch((err) => {
		res.json(err);
	})	
});

// Film Robot - relase date only start year
router.get('/filmrobot/genre=:genre_name?&imbd=:imbd?&relase=:start_year?&sort=:sort_val?&limit=:limit?',(req, res) => {	

	const { genre_name, imbd, sort_val, limit, start_year } = req.params;
	
	console.log(req.params)

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
		// match işlemi genres.label unwind edilen genresten geliyor
		{
			$match: {	

				"genres.label" : genre_name ? genre_name : { 
					$in: ['crime', 'comedy', 'horror', 'war', 'action', 'drama', 'history']
				},
				"imbd_rating" : imbd == undefined ? { "$gte" : "1" } : { "$gte" : imbd },
				"relase_year": { "$eq": parseInt(start_year ? start_year : 2000) },
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
                    genres:'$genres.genres',
                    relase_year:'$relase_year',
                    imbd_rating:'$imbd_rating',
                    duration:'$duration',
                    director:'$director',
                    cover:'$cover',
                    createdAt:'$createdAt',
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
		},
		{ $sort: { imbd_rating: parseInt(sort_val ? sort_val : -1 ) } },
		{ $limit : parseInt(limit ? limit : 10 ) },
	]);

	console.log(req.params)

	promise.then((data) => {
		res.json(data);
	}).catch((err) => {
		res.json(err);
	})	
});

// Get id
router.get('/:movie_id', (req, res) => {
    //const promise = MovieSchema.findById(req.params.movie_id);
    
	const promise = MovieSchema.aggregate([
		{
			$match: {
				'_id': mongoose.Types.ObjectId(req.params.movie_id)
			} 
        },
        { 
            "$lookup" : { 
                "from" : "persons", 
                "localField" : "director", 
                "foreignField" : "_id", 
                "as" : "director"
            }
        },
        { 
            "$lookup" : { 
                "from" : "genres", 
                "localField" : "genres", 
                "foreignField" : "_id", 
                "as" : "genres"
            }
        }, 
        { 
            "$lookup" : { 
                "from" : "persons", 
                "localField" : "cast", 
                "foreignField" : "_id", 
                "as" : "cast"
            }
        }, 
        { 
            "$unwind" : { 
                "path" : "$cast", 
                "preserveNullAndEmptyArrays" : true
            }
        }, 
        { 
            "$group" : { 
                "_id" : { 
                    "_id" : "$_id", 
                    "title" : "$title", 
                    "titleTr" : "$titleTr", 
                    "imbd_id" : "$imbd_id",
                    "synopsis": "$synopsis",
                    "genres" : "$genres", 
                    "relase_year" : "$relase_year", 
                    "imbd_rating" : "$imbd_rating", 
                    "duration" : "$duration", 
                    "director" : "$director", 
                    "cover" : "$cover", 
                    "images" : "$images",
                    "videos" : "$videos",
                    "countries" : "$countries",
                    "createdAt" : "$createdAt"
                }, 
                "cast" : { 
                    "$push" : "$cast"
                }
            }
        }, 
        { 
            "$project" : {                 
                "_id" : "$_id._id", 
                "title" : "$_id.title", 
                "titleTr" : "$_id.titleTr", 
                "imbd_id" : "$_id.imbd_id", 
                "genres" : "$_id.genres", 
                "relase_year" : "$_id.relase_year", 
                "imbd_rating" : "$_id.imbd_rating", 
                "duration" : "$_id.duration",
                "synopsis" : "$_id.synopsis",
                "director" : "$_id.director", 
                "cover" : "$_id.cover",
                "images" : "$_id.images",
                "videos" : "$_id.videos",
                "countries" : "$_id.countries",
                "createdAt" : "$_id.createdAt", 
                "cast" : "$cast"
            }
        }
	]);

	promise.then((data) => {
        const obj = Object.assign({}, ...data)
        //console.log('obj - ' + obj)
		res.json(obj);
	}).catch((err) => {
		res.json(err);
	})
});

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

router.get('*', (req, res) => {
	res.status(400).send("Error 404 not found");
});

module.exports = router;