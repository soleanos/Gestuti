var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var util = require('util');
var Utils = require('../utils');
var utils = new Utils();

/* GET signup page. */
router.get('/signup', function(req,res,next){
	res.render('pages/signup',{title: 'Signup', msgs:utils.read_messages(req)});
});

/* POST signup. */
router.post('/signup', function(req,res,next){
	console.log('signup demandé');
	//req.query pour les get, req.body pour les post
	if (!req.body.username || !req.body.password || !req.body.email){
		res.status(401);
        if (!req.body.username) utils.new_message(req,{type:'danger',msg:'User name not provided'});
        if (!req.body.email) utils.new_message(req,{type:'danger',msg:'Email not provided'});
        if (!req.body.password) utils.new_message(req,{type:'danger',msg:'Password not provided'});
        
		res.render('pages/signup', {title: 'Signup', msgs:utils.read_messages(req)});
		return;
	}
	//console.log('signup ok -> find user '); // on vérif si l'user n'existe pas:
	User.findOne({username: req.body.username},function(err, doc){
		if (err){
			throw err;
		}
		if (doc){
			res.status(403);
            utils.new_message(req,{type:'danger',msg:'User already exists'});
			res.render('pages/signup',{title:'Signup', msgs:utils.read_messages(req)});
			return;
		}
		//sinon, on crée le mdp
		var myhash = utils.hashPW(req.body.password.toString());
		//on enregistre le nouvel utilisateur
        var date = new Date();
		var user = new User({
            username: req.body.username, 
            hashed_password:myhash, 
            email: req.body.email, 
            date: date
        });
		user.save(function(err){
			if (err){
				throw err;
			}
            utils.new_message(req,{type:'success',msg:'Account successfully created !'});
			res.render('pages/signup',{title:'Signup', msgs:utils.read_messages(req),success:true});
		});
	});
});


/* POST login. */
router.post('/login',function(req, res, next) {
    User.findOne({username: req.body.username},function(err, doc){
        if(err) throw err;
        if (!doc) {
            utils.new_message(req,{type:'danger',msg:'User does not exist'})
            res.redirect('/');
            return;
        }
        if (utils.hashPW(req.body.password) == doc.hashed_password){
            req.session.userId = doc._id;
            res.render('pages/account',{title:'Account'});
        }
        else {
            utils.new_message(req,{type:'danger',msg:'Password does not match'});
            res.redirect('/');
        }
    });
});
    
/* GET logout. */
router.get('/logout',function(req,res,next){
    req.session.destroy();
     utils.new_message(req,{type:'info',msg:'User successfully logged out'})
    res.redirect('/');   
});

module.exports = router;