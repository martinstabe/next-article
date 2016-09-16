const api = require('next-ft-api-client');
const logger = require('@financial-times/n-logger').default;
const contentModel = require('ft-n-content-model');

module.exports = function (articleId, storyPackageIds, primaryTag, publishedDate) {

	let packageArticleFetch;
	let topicArticleFetch;

	if (storyPackageIds.length) {
		packageArticleFetch = api.content({
			uuid: storyPackageIds[0],
			index: 'v3_api_v2'
		})
			.then(article => contentModel(article, {useCase: 'article-card'}));
	}

	if (primaryTag) {
		topicArticleFetch = api.search({
			filter: ['metadata.idV1', primaryTag.id],
			// Get an extra so we can de-dupe
			count: 2,
			fields: [
				'id',
				'url',
				'title',
				'metadata',
				'summaries',
				'mainImage',
				'publishedDate',
				'webUrl'
			]
		})
			.then(articles => {
				articles = articles.filter(article => article.id !== articleId);
				return articles.length ? contentModel(articles[0], { useCase: 'article-card'}) : null;
			});
	}

	return Promise.all([ packageArticleFetch, topicArticleFetch ])
		.then(results => {
			let packageArticle = results[0];
			let topicArticle = results[1];

			if (!topicArticle && !packageArticle) {
				return;
			}

			// hierarchy of compellingness governing which read next article to return
			if (topicArticle && new Date(topicArticle.lastPublished) > new Date(publishedDate)) {
				// 1. return article with same topic as parent if more recent
				topicArticle.moreRecent = true;
				return topicArticle;
			} else if (packageArticle) {
				// 2. otherwise if story package return the first one
				return packageArticle;
			} else {
				// 3. failing that return the article on the same topic
				return topicArticle;
			}
		})
		.catch(error => {
			logger.warn('Fetching read next failed.', error.toString());
		});
};
