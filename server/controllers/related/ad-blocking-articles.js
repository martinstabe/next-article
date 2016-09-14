const api = require('next-ft-api-client');
const fetchres = require('fetchres');
const logger = require('@financial-times/n-logger').default;
const articlePodMapping = require('../../mappings/article-pod-mapping-v3');
const adBlockingArticlesTemplate = require('../../mappings/ad-blocking-articles-template');

module.exports = function (req, res) {

	const count = parseInt(req.query.count, 10);

	const url = 'http://api.ft.com/content/search/v1';
	const searchTerm = '"ad+blocking"';
	// HACK - Going directly to capi as Elastic search filtering API does not support free text search and there are case-sensitivity issues when using it for section pages.
	const body = {
		queryString: searchTerm,
		queryContext: {
			curations: ['ARTICLES', 'BLOGS']
		},
		resultContext: {
			maxResults: count,
			sortOrder: 'DESC',
			sortField: 'lastPublishDateTime'
		}
	};

	return fetch(url, {
			timeout: 3000,
			body: JSON.stringify(body),
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-Api-Key': process.env.api2key
			}
		})
			.then(function (response) {
				if (!response.ok) {
					logger.warn('Failed getting SAPIv1 content', {
						query: searchTerm,
						status: response.status
					});

				}
				return response;
			})
			.then(fetchres.json)
			.then(function (result) {
				const indexCount = result.results[0].indexCount;
				if (indexCount === 0) {
					return [];
				}
				return result.results[0].results
					.map(article => article.id)
					.filter(article => article);
			})
			.then(function (articles) {
				return api.content({
						uuid: articles,
						index: 'v3_api_v2'
					})
					.then(function (articles) {
						articles = articles
							.map(articlePodMapping)
							.map(article => adBlockingArticlesTemplate(article));
						return res.json({articles});
					});
			});

};
