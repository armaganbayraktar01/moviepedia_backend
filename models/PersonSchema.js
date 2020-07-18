// PersonSchema

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName= 'persons';


const PersonSchema = new Schema(
{
    fullname: {
        type: String,
        required: [true, '`{PATH}` alanı zorunludur.'],
        maxlength: [15, '`{PATH}` alanı en fazla ({MAXLENGTH}) karakter içerebilir'],
        minlength: [1, '`{PATH}` alanı en az ({MINLENGTH}) karakter içerebilir']
    },
    imbd_id: String,
    bio: String,
    jobs: Array,
    birth: Date,
    // Media
    cover: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model(collectionName, PersonSchema );