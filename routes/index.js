var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var util = require('util');
var Utils = require('../utils');
var utils = new Utils();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('pages/index', { user: req.user, msgs:utils.read_messages(req)});
});

module.exports = router;