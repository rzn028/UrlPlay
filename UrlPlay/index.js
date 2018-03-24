var express = require('express');
var app = express();

// MongoDB Connection
var mongoose = require('mongoose');
mongoose.connect('mongodb://abc:xyz@ds117489.mlab.com:17489/urlplay');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
	console.log("Connected To MLab cloud database");
});

// Schema
var urlSchema = mongoose.Schema({
	url: String,
	key: String,
	hits: Number,
	created: String
});

// Model
var Url = mongoose.model('Url', urlSchema);

app.use(express.static(__dirname + '/static'));
app.use(express.static(__dirname+'/public'));

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/',function(req, res){
	res.sendFile('shortner.html',{root:__dirname});
});

app.post('/short', function(req, res){
	function makeId(){
		var text = "";
    	var combination = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    	for(var i=0; i < 5; i++)
        	text += combination.charAt(Math.floor(Math.random() * combination.length));
    	return text;
	}
	var u = req.body.url;
	var k = req.body.key;
	
	if(k == "")
		k = makeId();

	var h = 0;
	var c = new Date();

	if(u != ""){
		// Adding values in DB
		var newUrl = new Url({url: u, key: k, hits: h, created: c});
		newUrl.save(function (err, testEvent) {
  			if (err) 
  				return console.error(err);
  			console.log("Short Url Created!!");
		});
		
		console.log("Url: "+u+'\nKey: '+k+'\nHits: '+h+'\nCreated at: '+c+'\n');
		res.send(k);
	}
});

app.post('/check',function(req, res){
	var k = req.body.key;
    Url.find({key:k},function (err, success) {
        if(success.length>0)
          res.send('available');
        else
          res.send('unavailable');
        if (err) 
        	return console.error(err);
    });
});

app.get('/:link', function(req, res){
	var key = req.params.link;
	Url.findOneAndUpdate({key:key},{$inc:{hits: 1}},function (err, url) {		// find search all and findOne search only for one
	    console.log(url);   	
        if(url)
        	res.redirect(url.url);
        else if (err)
        	return console.error(err);	
    });
	console.log("redirect request for: "+key);
});

app.get('/*',function(req, res){
	res.sendFile('error.html',{root:__dirname});
});

app.listen(process.env.PORT || 3000,function(){
	console.log('Server is up and running');
});