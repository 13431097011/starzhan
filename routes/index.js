var crypto = require('crypto');
var User = require('../models/user.js');
var Post = require('../models/post.js');
module.exports = function(app){
	app.get('/', function(req, res) {
		Post.get(null,function(err,posts){
			if(err){
				posts = [];
			}
			res.render('index', {
				active: {index:'active'},
				user:req.session.user,
				posts:posts,
				success:req.flash('success').toString(),
				error:req.flash('error').toString()
			});
		});
	});
	app.get('/content',function(req,res){
		res.render('content', { active: {content:'active'} });
	});
	app.get('/post',checkLogin);
	app.get('/post',function(req,res){
		res.render('post', {
			active: {post:'active'},
			user:req.session.user,
			success:req.flash('success').toString(),
			error:req.flash('error').toString()
		});
	});
	app.post('/post',checkLogin);
	app.post('/post',function(req,res){
		var currentUser = req.session.user;
		var post = new Post(currentUser.name,req.body.title,req.body.post);
		post.save(function(err){
			if(err){
				req.flash('error',err);
				return res.redirect('/');
			}
			req.flash('success','发布成功!');
			res.redirect('/');
		});
	});
	app.get('/upload',checkLogin);
	app.get('/upload',function(req,res){
		res.render('upload', {
			active: {post:'upload'},
			user:req.session.user,
			success:req.flash('success').toString(),
			error:req.flash('error').toString()
		});
	});
	app.post('/upload',checkLogin);
	app.post('/upload',function(req,res){
		req.flash('success','文件上传成功！');
		res.redirect('/upload');
	});
	

	app.get('/reg',checkNotLogin);
	app.get('/reg',function(req,res){
		res.render('reg', { 
			active: {reg:'active'},
			user:req.session.user,
			success:req.flash('success').toString(),
			error:req.flash('error').toString()
		 });
	});
	app.post('/reg',checkNotLogin);
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
	app.get('/login',checkNotLogin);
	app.get('/login',function(req,res){
		res.render('login', { 
			active: {login:'active'},
			user:req.session.user,
			success:req.flash('success').toString(),
			error:req.flash('error').toString()
		 });
	});
	app.post('/login',checkNotLogin);
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
	app.get('/logout',checkLogin)
	app.get('/logout',function(req,res){
		req.session.user = null;
		req.flash('success','退出成功！');
		return res.redirect('/');
	});

	function checkLogin(req,res,next){
		if(!req.session.user){
			req.flash('error','未登录！');
			res.redirect('/login');
		}
		next();
	}
	function checkNotLogin(req,res,next){
		if(req.session.user){
			req.flash('error','已登录!');
			res.redirect('back');
		}
		next();
	}

};
