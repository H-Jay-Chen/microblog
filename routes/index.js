// var express = require('express');
// var router = express.Router();
var crypto = require('crypto');
var User = require('../models/user.js');
var Post = require('../models/post.js');

/* GET home page. */
/*router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
module.exports = router;*/



/////////Here star mine///////////

/*	
	exports.index = function(req,res) {
		res.render('index',{title:'Express',layout:'layout.ejs'});
	};

	exports.user = function(req,res) {

	};

	exports.post = function(req,res) {

	};

	exports.reg = function(req,res) {

	};

	exports.doReg = function(req,res) {

	};

	exports.login = function(req,res) {

	};

	exports.doLogin = function(req,res) {

	};

	exports.logout = function(req,res) {

	};
*/

module.exports = function(app) {

	app.get('/',function(req,res) {
		res.render('index',{title:'首页',layout:'layout.ejs'});

		/*Post.get(null,function(err,posts) {
			if (err) {
				posts = [];
			}
			res.render('index',{
				title:'首页',
				posts:posts,
				layout:'layout.ejs'
			});
		});*/
	});
	
	app.get('/u/:user',function(req,res) {
		User.get(req.params.user,function (err,user) {
			if (!user) {
				req.flash('error','用户不存在');
				return res.redirect('/');
			}
			Post.get(user.name,function(err,posts) {
				if (err) {
					req.flash('error',err);
					return res.redirect('/');
				}
				res.render('user',{
					title:user.name,
					posts:posts,
					layout:'layout.ejs'
				});
			});
		});
	});
	
	app.get('/post',checkNotLogin);
	app.post('/post',function(req,res) {
		var currentUser = req.session.user;
		var post = new Post(currentUser.name,req.body.post);
		post.save(function (err) {
			if(err){
				req.flash('error',err);
				return res.redirect('/');
			}
			req.flash('success','发表成功');
			res.redirect('/u/'+currentUser.name);
		});
	});
	
	app.get('/reg',checkNotLogin);
	app.get('/reg',function(req,res) {
		res.render('reg',{title:'用户注册',layout:'layout.ejs'});
	});
	
	app.post('/reg',checkNotLogin);
	app.post('/reg',function(req,res) {
		//检验用户两次密码输入是否一致
		if (req.body['password-repeat'] != req.body['password']) {
			req.flash('error','两次输入的口令不一致');
			return res.redirect('/reg');
		}
		//生成口令的散列值
		var md5 = crypto.createHash('md5');
		var password = md5.update(req.body.password).digest('base64');

		var newUser = new User({
			name: req.body.username,
			password: password,
		});

		//检查用户名是否已存在
		User.get(newUser.name,function(err,user){
			if(user){
				err = 'Username already exist.';
			}
			if(err){
				req.flash('error',err);
				return redirect('/reg');
			}

			//如果不存在则新增用户
			newUser.save(function(err) {
				if(err) {
					req.flash('error',err);
					return redirect('/reg');
				}
				req.session.user = newUser;
				req.flash('success','注册成功');
				res.redirect('/');
			});
		});
	});
	
	app.get('/login',checkNotLogin);
	app.get('/login',function(req,res) {
		res.render('login',{title: '用户登入',layout:'layout.ejs'});
	});
	
	app.post('/login',checkNotLogin);
	app.post('/login',function(req,res) {
		//生成口令的散列值
		var md5 = crypto.createHash('md5');
		var password = md5.update(req.body.password).digest('base64');

		User.get(req.body.username,function(err,user) {
			if(!user) {
				req.flash('error','用户不存在');
				return res.redirect('/login');
			}
			if (user.password != password) {
				req.flash('error','用户口令错误');
				return res.redirect('/login');
			}
			req.session.user = user;
			req.flash('success','登入成功');
			res.redirect('/');
		});
	});
	
	app.get('/login',checkLogin);
	app.get('/logout',function(req,res) {
		req.session.user = null;
		req.flash('success','登出成功');
		res.redirect('/');
	});

};


function checkLogin(req,res,next) {
	if (!req.session.user) {
		req.flash('error','未登入');
		return res.redirect('/login');
	}
	next();
}

function checkNotLogin(req,res,next) {
	if (req.session.user) {
		req.flash('error','已登入');
		return res.redirect('/');
	}
	next();
}



