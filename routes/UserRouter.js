// UserRouter
const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const salt = 10;

// Models
const UserSchema = require('../models/UserSchema');

// GET ALL
router.get('/', (req, res, next) => {

    const promise = UserSchema.aggregate([
		{
			$sort: {
				createdAt: 1
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
router.get('/:user_id', (req, res, next) => {

    const promise = UserSchema.findById(req.params.user_id);

    promise.then((data) => {
        if (!data)
            next({ message: 'The data was not found.', code: 404 });

    res.json(data);

    }).catch((err) => {
        res.json(err);
    });
});
/*
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
*/

// Put
router.put('/:user_id', (req, res, next) => {

    const { user_name, user_password, user_email, user_fullname, user_question, user_answer, user_role, user_bio, user_birth, user_picture } = req.body;
    
    bcrypt.hash(user_password, salt).then((hash) => {
  
        const newData = {
            user_name,
            user_password : hash, 
            user_email, 
            user_fullname, 
            user_question, 
            user_answer,
            user_role, 
            user_bio, 
            user_birth, 
            user_picture
        };

        const promise = UserSchema.findByIdAndUpdate(
            req.params.user_id,
            newData,
            {
                new: true
            }
        );     

        promise.then((data) => {
            if (!data)
                next({ message: 'The data was not found.', code: 404 });

        res.json(data);
        }).catch((err) => {
            res.json(err);
        });
    });
});

/* POST register User */
router.post('/', (req, res, next) => {
    const {user_name, user_password, user_email, user_fullname, user_question, user_answer, user_role, user_bio, user_birth, user_picture } = req.body;
    //const newData = new UserSchema(req.body);
    
    bcrypt.hash(user_password, salt).then((hash) => {
  
        const newData = new UserSchema({
        user_name,
        user_password : hash, 
        user_email, 
        user_fullname, 
        user_question, 
        user_answer,
        user_role, 
        user_bio, 
        user_birth, 
        user_picture
        });

        const promise = newData.save();

        promise.then((data) => {
            if (!data)
                next({ message: 'The data was not found.', code: 404 });

        res.json(data);
        }).catch((err) => {
            res.json(err);
        });
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
