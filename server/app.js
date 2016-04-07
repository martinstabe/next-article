'use strict';

const express = require('@financial-times/n-express');
const bodyParser = require('body-parser');
const checks = require('./checks/main.js');

// Starts polling checks
checks.init();

const app = module.exports = express({
	name: 'article',
	withFlags: true,
	withHandlebars: true,
	withNavigation: true,
	withAnonMiddleware: true,
	withBackendAuthentication: true,
	healthChecks: [
		checks.esv3,
		checks.livefyre,
		checks.errorRate
	]
});

require('./lib/ig-poller').start();
require('./lib/blogs-access-poller').start();

app.use(bodyParser.json());
app.post('^/preview$', require('./controllers/preview'));

const uuid = '[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}';

app.use(`^/content/:id(${uuid})$`, require('./controllers/access'));

app.get('^/article/:id/story-package', require('./controllers/related/story-package'));
app.get('^/article/:id/more-on', require('./controllers/related/more-on'));
app.get('^/article/:id/special-report', require('./controllers/related/special-report'));
app.get('^/article/:id/social-counts', require('./controllers/related/social-counts'));
app.get('/embedded-components/slideshow/:id', require('./controllers/slideshow'));

app.get(`^/content/:id(${uuid})$`, require('./controllers/negotiation'));

app.get('/__gtg', (req, res) => {
	res.status(200).end();
});

// Start the app
const port = process.env.PORT || 3001;

module.exports.listen = app.listen(port, () => {
	express.logger.info("Listening on " + port);
});
