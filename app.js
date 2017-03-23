var express = require('express');
/*var connect = require('connect');*/
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var MongoStore = require('connect-mongo')(session);
var settings = require('./settings');
var flash = require('connect-flash');

// var index = require('./routes/index');
// var users = require('./routes/users');
var routes = require("./routes");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(partials());
app.use(flash());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({              //session提供会话支持；设置它的store参数为MongoStore实例，把会话信息存入数据库中。
	resave: false,
	saveUninitialized: true,
	secret: settings.cookieSecret,
	store: new MongoStore({
		db: settings.db,
		url: 'mongodb://localhost/27017'
	})
}));
//////创建一个动态视图助手（locals方法）/////////////////////////////
app.use(function(req,res,next){
  res.locals.user=req.session.user;

  var err = req.flash('error');
  var success = req.flash('success');

  res.locals.error = err.length ? err : null;
  res.locals.success = success.length ? success : null;
   
  next();
});


/*app.get('/',function(req,res) {
		res.render('index',{title:'首页',layout:'layout.ejs'});
	});*/
app.use(express.Router(routes(app)));                            //调用路由进行相应路径的处理
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', index);
// app.use('/users', users);
////////////Here star my routes（现已整合到routes模块中）///////////
// app.get('/',routes.index);
// app.get('/u/:user',routes.user);
// app.post('/post',routes.post);
// app.get('/reg',routes.reg);
// app.post('/reg',routes.doReg);
// app.get('/login',routes.login);
// app.post('/login',routes.doLogin);
// app.get('/logout',routes.logout);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(3000);
console.log("listen at localhost/3000.");

module.exports = app;


//////创建一个动态视图助手(Express4.0之后不再支持dynamicHelpers方法了)/////////////////////////////
/*app.dynamicHelpers({
	user: function(req,res) {
		return req.session.user;
	},
	error: function(req,res) {
		var err = req.flash('error');
		if (err.length) {
			return err;
		}
		else {
			return null;
		}
	},
	success: function(req,res) {
		var succ = req.flash('success');
		if (succ.length) {
			return succ;
		}
		else {
			return null;
		}
	},
});*/
