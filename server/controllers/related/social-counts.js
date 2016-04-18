'use strict';

const fetchres = require('fetchres');
const logger = require('@financial-times/n-logger').default;
const services = 'facebook,gplus,twitter,stumbleupon,reddit';
const metrics = 'comments,shares,votes,endorsements';

function getShareCounts(articleUrl) {
	let url = `https://ft-next-sharedcount-api.herokuapp.com/v1/getCounts?groupby=url` +
			`&services=${services}&metrics=${metrics}&source=next-article` +
			`&urls=${articleUrl}`;
	return fetch(url, { timeout: 3000 })
		.then(fetchres.json);
};


module.exports = function(req, res, next) {
	let url = req.query.url;

	getShareCounts(url)
		.then(function(results) {
			let shareCounts = results[url]; //Grouped results return a key of undefined
			res.json({
				shares: shareCounts
			})
		})
		.catch(function(err) {
			if (err.name === fetchres.BadServerResponseError.name
				|| err.message.indexOf('timeout') > -1) {
				logger.error({ event: 'BAD_UPSTREAM_RESPONSE', status: 504, error: err.name });
				res.sendStatus(504).end();
			} else {
				next(err);
			}
		});
}
