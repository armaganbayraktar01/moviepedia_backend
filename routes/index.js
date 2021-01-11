const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const salt = 10;

// Models
const UserSchema = require('../models/UserSchema');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});


/* POST register User */
router.post('/api/register', (req, res, next) => {
  const {user_name, user_password, user_email, user_fullname, user_question, user_answer, user_role, user_bio, user_birth, user_picture } = req.body;
  //const newData = new UserSchema(req.body);

  UserSchema.findOne({
    user_name
  }, (err, userQuery) => 
  {

    if (err)
      throw err;

    if (userQuery){
      res.json({
        //status: false,
        message: `${user_name + " is already in use."}`
      });

    } else {

      UserSchema.findOne({
        user_email
      }, (err, userQuery) => 
      {
    
        if (err)
          throw err;
    
        if (userQuery)
        {
          res.json({
            //status: false,
            message: `${user_email + " is already in registered."}`
          });
    
        } else {          

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
          
            //res.json(data);

            res.json({
              status: true,
              message: "Registration successful"
            });

            }).catch((err) => {
                res.json(err);
            });
          });
        }
      });
    }
  });
});

/* POST auth User */
router.post('/api/auth', (req, res, next) => {
  const {user_name, user_password, user_email, user_fullname, user_question, user_answer, user_role, user_bio, user_birth, user_picture } = req.body;

  UserSchema.findOne({
    user_name
  }, (err, userQuery) => {

    if (err)
      throw err;

    if (!userQuery){
      res.json({
        status: false,
        message: "Authentication failed, user not found."
      });

    } else {

      bcrypt.compare(user_password, userQuery.user_password).then((result) => {

        if ( !result )
        {

          res.json({
            status: false,
            message: "Authentication failed, wrong password."
          });

        } else {

          const {user_role, user_fullname} = userQuery;


          const payload = { // buraya daha fazla veri eklenebilir user_email vs.
            user_name,
            user_fullname,
            user_role
          };

          const token = jwt.sign(payload, req.app.get('api_secret_key'), {
            expiresIn: 60*60 // saniye cinsidir 1 saatlik token
          });
          
          res.json({
            status: true,
            message: `${ user_name + " authentication successful, redirect"}`,
            token
          });

        }

      });
    }
  });

});

module.exports = router;
