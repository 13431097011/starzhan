//var express = require('express');
//var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

module.exports = function(app){
	app.get('/', function(req, res) {
		res.render('index', { active: {index:'active'} });
	});
	app.get('/content',function(req,res){
		res.render('content', { active: {content:'active'} });
	});
	app.get('/post',function(req,res){
		res.render('post', { active: {post:'active'} });
	});
};
