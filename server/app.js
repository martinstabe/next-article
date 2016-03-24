'use strict';

const express = require('ft-next-express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const checks = require('./checks/main.js');

// Starts polling checks
checks.init();

const app = module.exports = express({
	name: 'article',
	healthChecks: [
		checks.esv3,
		checks.livefyre,
		checks.errorRate
	]
});

const barriers = require('ft-next-barriers');
require('./lib/ig-poller').start();
require('./lib/blogs-access-poller').start();

app.use(bodyParser.json());
app.use(cookieParser());
app.post('^/preview$', require('./controllers/preview'));

const uuid = '[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}';

// COMPLEX: Put access middleware before barrier middleware so that access can be cached by membership
app.use(`^/content/:id(${uuid})$`, require('./controllers/access'));

// These routes supply supplement content for an article so don't need to go through barriers middleware
app.get('^/article/:id/story-package', require('./controllers/related/story-package'));
app.get('^/article/:id/more-on', require('./controllers/related/more-on'));
app.get('^/article/:id/special-report', require('./controllers/related/special-report'));
app.get('^/article/:id/social-counts', require('./controllers/related/social-counts'));
app.get('/embedded-components/slideshow/:id', require('./controllers/slideshow'));

// Use barriers middleware only before calling full article endpoints
app.use(barriers.middleware(express.metrics));

app.get(`^/content/:id(${uuid})$`, require('./controllers/negotiation'));

app.get('/__gtg', (req, res) => {
	res.status(200).end();
});

// Start the app
const port = process.env.PORT || 3001;

module.exports.listen = app.listen(port, () => {
	express.logger.info("Listening on " + port);
});
