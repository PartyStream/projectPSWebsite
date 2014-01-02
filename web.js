
/**
 * Module dependencies.
 */

var express = require('express'),
    pg     = require('pg').native,
    pgUrl = process.env.DATABASE_URL,
    client = new pg.Client(process.env.DATABASE_URL),
    routes = require('./routes');

var app = module.exports = express.createServer();

console.log("Server Created");

// Connect To DB
client.connect();

console.log("Connected To Database");

//Mandrill
var Mandrill = require('mandrill-api').Mandrill;
var man = new Mandrill();
man.users.info(function(info) {
    console.log('Reputation: ' + info.reputation + ', Hourly Quota: ' + info.hourly_quota);
});

console.log("Mandrill Object Created");

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
app.use(express.compiler({ src : __dirname + '/public', enable: ['less']}));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

console.log("Express using Jade and Less");

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Compatible

// Now less files with @import 'whatever.less' will work(https://github.com/senchalabs/connect/pull/174)
var TWITTER_BOOTSTRAP_PATH = './vendor/twitter/bootstrap/less';
express.compiler.compilers.less.compile = function(str, fn){
  try {
    var less = require('less');var parser = new less.Parser({paths: [TWITTER_BOOTSTRAP_PATH]});
    parser.parse(str, function(err, root){fn(err, root.toCSS());});
  } catch (err) {fn(err);}
};

// Routes

app.get('/', routes.index);
app.get('/beta',routes.ship);
app.get('/index', routes.index);
app.get('/index*', routes.index);
app.get('/google572bca5588404eef.html', routes.googleVerification);
app.get('/sitemap',routes.siteMap);
app.get('/sitemap*',routes.siteMap);

// Register
app.post('/register', function (req,res){
  routes.register(req.body.email,req.headers,req.connection.remoteAddress,res,client,man);
});

var port = process.env.PORT || 3000;

app.listen(port, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
module.exports = app;
