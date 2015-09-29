var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	console.log("Im inside get")
	res.render('chat');
});

module.exports = router;
