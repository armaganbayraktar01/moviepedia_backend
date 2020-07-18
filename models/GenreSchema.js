// MovieSchema

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName= 'genres'; // db de sonuna s gelerek movies olacak

const GenreSchema = new Schema(
{
    label: {
        type: String,
        required: [true, '`{PATH}` alanı zorunludur.'],
        maxlength: [25, '`{PATH}` alanı en fazla ({MAXLENGTH}) karakter içerebilir'],
        minlength: [1, '`{PATH}` alanı en az ({MINLENGTH}) karakter içerebilir']
    }, 
    value: {
        type: String,
    },
     createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model(collectionName, GenreSchema);