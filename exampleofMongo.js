/*var mongodb = require('mongodb');
var util = require('util');
var default_port = mongodb.Connection.DEFAULT_PORT;
var db = new mongodb.Db("test2", new mongodb.Server('localhost', default_port, {}));
db.open(function(err, db) {
  console.log("connected to mongodb");
  // initialize the collection objects
  db.collection('users', function(err, collection) {
    var p = {name:"pete"};
    db.users = collection;
    db.users.insert(p, function(err, result) {
      db.close();
      console.log(util.inspect(err));
      console.log(util.inspect(result));
    });
  });  
});*/




var mongo = require('mongodb');
var host = "localhost";
var port =27017;    //mongo.Connection.DEFAULT_PORT;
//创建MongoDB数据库所在服务器的Server对象
var server = new mongo.Server(host, port, {auto_reconnect:true});
//创建MongoDB数据库
var db = new mongo.Db('node-mongo-example', server, {saft:true});
//数据库连接操作
db.open(function(err, db){
  if(err) {
    console.log('连接数据库发生错误');
    throw err;}
  else{
    console.log("成功建立数据库连接");
    db.close();
  }
});
db.on('close',function(err,db){
  if (err) {throw err;}
  else{
    console.log("成功关闭数据库");
  }
})




/*var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

//连接test数据库
var url = 'mongodb://localhost:27017/test';
MongoClient.connect(url, (err,db) => {
    assert.equal(null,err);
    console.log('连接成功');
    db.close();
});*/