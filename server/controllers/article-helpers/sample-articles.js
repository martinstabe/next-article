'use strict';
const api = require('next-ft-api-client');
const get = require('lodash/fp/get');
const map = require('lodash/fp/map');
const flatten = require('lodash/fp/flatten');
const without = require('lodash/fp/without');
const indexOf = require('lodash/fp/indexOf');
const keyBy = require('lodash/fp/keyBy');
const sampleArticles = [
	{
		title: 'US Election and economy',
		articles: [
			'3c0cabbc-114c-11e6-91da-096d89bd2173',
			'7e40b256-42d1-11e6-b22f-79eb4891c97d',
			'955e9bbc-2e70-11e6-a18d-a96ab29e3c95',
			'b84e97f4-13c6-11e6-91da-096d89bd2173',
			'44088ede-5027-11e6-8172-e39ecd3b86fc',
			'a8e9f23c-1695-11e6-9d98-00386a18e39d',
			'c5c01bee-22c4-11e6-aa98-db1e01fabc0c',
		],
	},
	{
		title: 'Xi\'s China',
		articles: [
			'2cb93908-2c65-11e6-bf8d-26294ad519fc',
			'1dbd8c60-0cc6-11e6-ad80-67655613c2d6',
			'42eca2b6-3d4d-11e6-8716-a4a71e8140b0',
			'57371736-4b69-11e6-88c5-db83e98a590a',
			'103712f6-4979-11e6-8d68-72e9211e86ab',
			'f5bc9fac-27dd-11e6-8ba3-cdd781d02d89',
			'0c567656-5494-11e6-befd-2fc0c26b3c60',
		],
	},
	{
		title: 'APAC economy and politics',
		articles: [
			'a9878bea-2eec-11e6-bf8d-26294ad519fc',
			'e9baebee-0bd8-11e6-9456-444ab5211a2f',
			'eb0e795a-3d17-11e6-9f2c-36b487ebd80a',
			'7bd05b02-4344-11e6-9b66-0712b3873ae1',
			'4fd7dd18-5523-11e6-befd-2fc0c26b3c60',
			'52072080-4a6f-11e6-8d68-72e9211e86ab',
			'2e4c61f2-4ec8-11e6-8172-e39ecd3b86fc',
		],
	},
	{
		title: 'Emerging Markets',
		articles: [
			'1c067b52-1829-11e6-bb7d-ee563a5a1cc1',
			'b9594ce8-2e15-11e6-a18d-a96ab29e3c95',
			'1ae8dade-0245-11e6-99cb-83242733f755',
			'd7c6fa2a-0630-11e6-9b51-0fb5e65703ce',
			'5e07c48c-526e-11e6-9664-e0bdc13c3bef',
			'd1e89e0a-37c8-11e6-a780-b48ed7b6126f',
			'87ac0208-4e54-11e6-8172-e39ecd3b86fc',
		],
	},
];

function topicIndexOf (contentId) {
	return indexOf(true)(
		map((topic) => indexOf(contentId)(topic.articles) !== -1)(sampleArticles)
	);
}

module.exports = function getCuratedArticles (contentId) {
	const currentTopicIndex = topicIndexOf(contentId);
	const articlesWithoutCurrent = map((topic) => ({
		title: topic.title,
		articles: without(contentId)(topic.articles)
	}))(sampleArticles);
	const articlesToFetch = flatten(map(get('articles'))(articlesWithoutCurrent));
	return api.content({ uuid: articlesToFetch })
		.then((articles) => {
			const mappedArticles = keyBy('id')(articles);
			articles = map((topic) => ({
				title: topic.title,
				articles: map((id) => mappedArticles[id])(topic.articles)
			}))(sampleArticles);
			const mainTopic = articles[currentTopicIndex];
			return {
				mainTopic,
				otherTopics: without(mainTopic)(articles),
			};
		});
}

module.exports.isSampleArticle = function isSampleArticle (contentId) {
	return topicIndexOf(contentId) !== -1;
}
