//以下代码通过module.exports输出了创建的数据库连接。


var settings = require('../settings');
var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server_mongo = require('mongodb').Server; 


module.exports = new Db(settings.db, new Server_mongo(settings.host,27017,{}),{safe: true});   //Connection.DEFAULT_PORT