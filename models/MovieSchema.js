// MovieSchema

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName= 'movies'; // db de sonuna s gelerek movies olacak

const MovieSchema = new Schema(
{
    title: {
        type: String,
        required: [true, '`{PATH}` alanı zorunludur.'],
        maxlength: [25, '`{PATH}` alanı en fazla ({MAXLENGTH}) karakter içerebilir'],
        minlength: [1, '`{PATH}` alanı en az ({MINLENGTH}) karakter içerebilir']
    },
    titleTr: {
        type: String,
        maxlength: [25, '`{PATH}` alanı en fazla ({MAXLENGTH}) karakter içerebilir'],
        minlength: [1, '`{PATH}` alanı en az ({MINLENGTH}) karakter içerebilir']
    },

    // storyline
    imbd_id: String,
    synopsis: {
        type: String,
        maxlength: [300, '`{PATH}` alanı en fazla ({MAXLENGTH}) karakter içerebilir'],
        minlength: [10, '`{PATH}` alanı en az ({MINLENGTH}) karakter içerebilir']
    },

    genres: [Schema.Types.ObjectId],

    // details
    relase_year: {
        type: Number,
        max: 2030,
        min: 1900
    }, // year
    imbd_rating: {
        type: String,
        max: 10,
        min: 0
    }, // score 
    duration: {
        type: Number,
        max: 250,
        min: 1
    },
    countries: {
        type: Number,
        max: 250,
        min: 1
    },
    // cast director
    director: [Schema.Types.ObjectId], // director id
    cast: [Schema.Types.ObjectId],
    // Media
    cover: String,
    images: [{
        url: String,
        thumbUrl: String,
        title: String,
        desc: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    videos: [{
        url: String,
        ytid: String,
        title: String,
        desc: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model(collectionName, MovieSchema);