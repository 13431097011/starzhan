var crypto = require('crypto');
var User = require('../models/user.js');
module.exports = function(app){
	
	app.get('/', function(req, res) {
		res.render('index', {
			active: {index:'active'},
			user:req.session.user,
			success:req.flash('success').toString(),
			error:req.flash('error').toString()

		 });
	});
	app.get('/content',function(req,res){
		res.render('content', { active: {content:'active'} });
	});
	app.get('/post',function(req,res){
		res.render('post', { active: {post:'active'} });
	});
	app.get('/login',function(req,res){
		res.render('login', { 
			active: {login:'active'},
			user:req.session.user,
			success:req.flash('success').toString(),
			error:req.flash('error').toString()
		 });
	});
	app.get('/reg',function(req,res){
		res.render('reg', { 
			active: {reg:'active'},
			user:req.session.user,
			success:req.flash('success').toString(),
			error:req.flash('error').toString()
		 });
	});
	app.post('/reg',function(req,res){
		var name = req.body.name;
		var pwd = req.body.pwd;
		var pwd_re = req.body['pwd_re'];
		if(pwd != pwd_re){
			return req.flash('error','两次输入密码不一致!');
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
	});
	app.post('/login',function(req,res){
		var md5 = crypto.createHash('md5');
		var pwd = md5.update(req.body.pwd).digest('hex');
		console.log(req.body.name,req.body.pwd);
		User.get(req.body.name,function(err,user){
			if(!user){
				req.flash('error','用户不存在！');
				return res.redirect('/login');
			}
			if(user.pwd!=pwd){
				req.flash('error','密码错误!');
				return res.redirect('/login');
			}
			req.session.user = user;
			req.flash('success','登录成功！');
			return res.redirect('/');
		});
	});
	app.get('/logout',function(req,res){
		req.session.user = null;
		req.flash('success','退出成功！');
		return res.redirect('/');
	});

};
