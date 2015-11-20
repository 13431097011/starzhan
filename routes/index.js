//var express = require('express');
//var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });
var crypto = require('crypto');
var User = require('../models/user.js');
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
	app.get('/login',function(req,res){
		res.render('login', { active: {index:'active'} });
	});
	app.get('/reg',function(req,res){
		res.render('reg', { active: {index:'active'} });
	});
	app.post('/reg',function(req,res){
		var name = req.body.name;
		var pwd = req.body.pwd;
		var pwd_re = req.body['pwd_re'];
		if(pwd != pwd_re){
			req.flash('error','两次输入密码不一致!');
		}
		var md5 = crypto.createHash('md5');
		var pwd = md5.update(req.body.pwd).digest('hex');
		var newUser = new User({
			name:req.body.name,
			pwd:pwd,
			email:req.body.email
		});
		User.get(newUser.name,function(err,user){
			if(err){
				req.flash('error',err);
				return res.redirect('/');
			}
			if(user){
				req.flash('error','用户已存在!');
				return res.redirect('/reg');
			}
			newUser.save(function(err,user){
				if(err){
					req.flash('error',err);
					return res.redirect('/reg');
				}
				req.session.user = user;
				req.flash('success','注册成功！');
				res.redirect('/');
			});
		});


	})
};
