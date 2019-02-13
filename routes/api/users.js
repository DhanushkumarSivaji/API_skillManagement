const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');
const mongoose = require('mongoose')

//Load input validation
const validateRegisterInput =   require('../../validation/register')
const validateLoginInput =   require('../../validation/login')



// Load User Model
const User = require('../../models/User');


// @route GET api/users/test
// @desc Tests users route
// @access Public
router.get('/test',(req,res)=>res.json({msg:"users works"}))

// @route GET api/users/test
// @desc Tests users route
// @access Public
router.post('/register',(req,res)=>{


   const {errors , isValid} = validateRegisterInput(req.body);
   console.log("req.data",req.body)
   
   if(!isValid){
       return res.status(400).json(errors);
   }

    User.findOne({email:req.body.email})
    .then(user => {
        if(user){
            errors.email="email address already exists"
            return res.status(400).json(errors);
        } else {

            const avatar = gravatar.url(req.body.email,{
                s:'200', //size
                r:'pg',  //rating
                d:'mm'  //Default
            });

            const newUser = new User({
                name : req.body.name,
                email:req.body.email,
                avatar,
                password:req.body.password,
                role:req.body.role
            })

            bcrypt.genSalt(10,(err,salt)=>{
                bcrypt.hash(newUser.password,salt,(err,hash) =>{
                    if(err) throw err;
                    newUser.password = hash;
                    newUser.save()
                    .then(user => res.json(user))
                    .catch(err => console.log(err));
                })
            })
        }
    })
})


// @route GET api/users/login
// @desc login user / returning jwt token
// @access Public

router.post('/login',(req,res)=>{


    const {errors , isValid} = validateLoginInput(req.body);
    console.log(isValid , errors)
    if(!isValid){
        return res.status(400).json(errors);
    }


    const email = req.body.email
    const password = req.body.password

    //Find user by email
    User.findOne({email})
    .then(user =>{
        //check for user
        if(!user){
            errors.email='user not found'
            return res.status(404).json(errors)
        }
        //check password
        bcrypt.compare(password,user.password)
        .then(isMatch => {
            if(isMatch){
              const payload = {id:user.id,name:user.name,avatar:user.avatar}

              jwt.sign(
                  payload,
                  keys.secretOrKey,
                  {expiresIn:72000},
                  (err,token)=>{
                      res.json({
                          success:true,
                          token:'Bearer ' + token
                      })
                  }

              )
            } else {
                errors.password = "password incorrect"
                return res.status(400).json(errors)
            }
        })
    })
})



// @route GET api/users/current
// @desc Return current user
// @access Private

router.get('/current',passport.authenticate('jwt',{session:false}),(req,res)=>{
    res.json({
        id: req.user.id,
        name:req.user.name,
        email:req.user.email,
        role:req.user.role

    })
})

// @route   POST api/users/update/:user_id
// @desc    edit user profile
// @access  Private

router.post('/update/:user_id',passport.authenticate('jwt',{session:false}),(req,res)=>{
    
    let data = {
        findQuery: {
            _id: mongoose.Types.ObjectId(req.params.userId)
        },
        model: User,
        updateQuery: {}
    }
  
    if(req.body.name) {
        data.updateQuery.name = req.body.name
    }
    if(req.body.role) {
        data.updateQuery.role = req.body.role
    }
    if(req.body.email) {
        data.updateQuery.email = req.body.email
    }

     try{
        
        console.log(data.updateQuery)

       data.model.findOneAndUpdate(req.params.userId, data.updateQuery).then(docs => {
         console.log(docs)
         return res.status(200).json({docs})
       }).catch(err => {
         return res.json({err})
       })
     }catch(err){
       console.log('Something went wrong: CrudRepository: find', err)
     }
  
})

module.exports = router;
