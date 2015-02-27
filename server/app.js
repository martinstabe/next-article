/*jshint node:true*/
'use strict';

var express = require('ft-next-express');
var Metrics = require('next-metrics');
var ifIsAdSlotHelper = require('./view-helpers/if-is-ad-slot');

require('heroku-seppuku')();

Metrics.init({ app: 'grumman', flushEvery: 30000 });

var app = module.exports = express({
	helpers: {
		ifIsAdSlot: ifIsAdSlotHelper
	}
});

app.get('/', function(req, res) {
	res.redirect('/search?q=page:Front%20page');
});

// The Access endpoint calls this to establish content classification
app.head(/^\/([a-f0-9]+\-[a-f0-9]+\-[a-f0-9]+\-[a-f0-9]+\-[a-f0-9]+)/, require('./controllers/access'));

app.get(/^\/fastft\/([0-9]+)(\/[\w\-])?/, require('./controllers/fastft'));
app.get(/^\/([a-f0-9]+\-[a-f0-9]+\-[a-f0-9]+\-[a-f0-9]+\-[a-f0-9]+)\/main-image/, require('./controllers/capi-main-image'));
app.get(/^\/([a-f0-9]+\-[a-f0-9]+\-[a-f0-9]+\-[a-f0-9]+\-[a-f0-9]+)\/authors/, require('./controllers/capi-authors'));
app.get(/^\/([a-f0-9]+\-[a-f0-9]+\-[a-f0-9]+\-[a-f0-9]+\-[a-f0-9]+)\/next-article/, require('./controllers/next-article'));
app.get(/^\/([a-f0-9]+\-[a-f0-9]+\-[a-f0-9]+\-[a-f0-9]+\-[a-f0-9]+)/, require('./controllers/capi'));



app.get('/more-on/:id', require('./controllers/more-on'));
app.get('/more-on/:metadata/:id', require('./controllers/more-on-topic'));
app.get('/embedded-components/slideshow/:id', require('./controllers/slideshow'));
app.get('/embedded-components/image/:id', require('./controllers/image'));
app.get('/__gtg', function(req, res) {
	console.log('gtg requested');
	res.status(200).end();
});

// Start the app
var port = process.env.PORT || 3001;
app.listen(port, function() {
	Metrics.count('express.start');
	console.log("Listening on " + port);
});
