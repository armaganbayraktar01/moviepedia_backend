// UserSchema

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName= 'users';


const UserSchema = new Schema(
{
    user_name: {
        type: String,
        required: [true, '`{PATH}` alanı zorunludur.'],
        unique: true,
        maxlength: [15, '`{PATH}` alanı en fazla ({MAXLENGTH}) karakter içerebilir'],
        minlength: [1, '`{PATH}` alanı en az ({MINLENGTH}) karakter içerebilir']
    },
    user_password: {
        type: String,
        required: [true, '`{PATH}` alanı zorunludur.'],
        maxlength: [100, '`{PATH}` alanı en fazla ({MAXLENGTH}) karakter içerebilir'],
        minlength: [6, '`{PATH}` alanı en az ({MINLENGTH}) karakter içerebilir']
    },
    user_email: {
        type: String,
        required: [true, '`{PATH}` alanı zorunludur.'],
        unique: true,
        maxlength: [30, '`{PATH}` alanı en fazla ({MAXLENGTH}) karakter içerebilir'],
        minlength: [1, '`{PATH}` alanı en az ({MINLENGTH}) karakter içerebilir']
    },
    user_fullname: {
        type: String,
        maxlength: [30, '`{PATH}` alanı en fazla ({MAXLENGTH}) karakter içerebilir'],
        minlength: [1, '`{PATH}` alanı en az ({MINLENGTH}) karakter içerebilir']
    },
    user_question: {
        type: String,
        //required: [true, '`{PATH}` alanı zorunludur.'],
        maxlength: [30, '`{PATH}` alanı en fazla ({MAXLENGTH}) karakter içerebilir'],
        minlength: [1, '`{PATH}` alanı en az ({MINLENGTH}) karakter içerebilir']
    },
    user_answer: {
        type: String,
        //required: [true, '`{PATH}` alanı zorunludur.'],
        maxlength: [30, '`{PATH}` alanı en fazla ({MAXLENGTH}) karakter içerebilir'],
        minlength: [1, '`{PATH}` alanı en az ({MINLENGTH}) karakter içerebilir']
    },
    user_role: {
        type: String,
        default: "3"
    },
    user_bio: String,
    user_birth: Date,
    // Media
    user_picture: {
        type: String,
        default: "https://www.w3schools.com/howto/img_avatar.png"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
    
});

module.exports = mongoose.model(collectionName, UserSchema );