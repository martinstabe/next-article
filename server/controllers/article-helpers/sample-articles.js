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
		title: 'US Election and Economy',
		articles: [
			'c5c01bee-22c4-11e6-aa98-db1e01fabc0c',
			'8e8ea132-49b5-11e6-8d68-72e9211e86ab',
			'ab2b473e-2c99-11e6-a18d-a96ab29e3c95',
			'b84e97f4-13c6-11e6-91da-096d89bd2173',
			'79b6c91a-5298-11e6-9664-e0bdc13c3bef',
			'955e9bbc-2e70-11e6-a18d-a96ab29e3c95',
			'add048e4-4e32-11e6-88c5-db83e98a590a',
			'7e40b256-42d1-11e6-b22f-79eb4891c97d',
			'3c0cabbc-114c-11e6-91da-096d89bd2173',
			'a8e9f23c-1695-11e6-9d98-00386a18e39d',
			'a04bcc50-238c-11e6-aa98-db1e01fabc0c',
			'44088ede-5027-11e6-8172-e39ecd3b86fc',
			'847c6b08-3a28-11e6-a780-b48ed7b6126f',
			'42b87c12-622c-11e6-8310-ecf0bddad227',
		],
	},
	{
		title: 'Xi\'s China',
		articles: [
			'f5bc9fac-27dd-11e6-8ba3-cdd781d02d89',
			'1dbd8c60-0cc6-11e6-ad80-67655613c2d6',
			'103712f6-4979-11e6-8d68-72e9211e86ab',
			'2cb93908-2c65-11e6-bf8d-26294ad519fc',
			'42eca2b6-3d4d-11e6-8716-a4a71e8140b0',
			'9831cf8e-4906-11e6-8d68-72e9211e86ab',
			'324d82c4-2d60-11e6-a18d-a96ab29e3c95',
			'f059fb22-3787-11e6-a780-b48ed7b6126f',
			'6700d5cc-3209-11e6-ad39-3fee5ffe5b5b',
			'ccd94b46-4db5-11e6-88c5-db83e98a590a',
			'dde0af68-4db2-11e6-88c5-db83e98a590a',
			'57371736-4b69-11e6-88c5-db83e98a590a',
		],
	},
	{
		title: 'Asia Pacific Economy and Politics',
		articles: [
			'e9baebee-0bd8-11e6-9456-444ab5211a2f',
			'52072080-4a6f-11e6-8d68-72e9211e86ab',
			'eb0e795a-3d17-11e6-9f2c-36b487ebd80a',
			'3aa363f6-382f-11e6-a780-b48ed7b6126f',
			'a9878bea-2eec-11e6-bf8d-26294ad519fc',
			'df027048-4a42-11e6-8d68-72e9211e86ab',
			'831ace74-3471-11e6-bda0-04585c31b153',
			'7bd05b02-4344-11e6-9b66-0712b3873ae1',
			'4fd7dd18-5523-11e6-befd-2fc0c26b3c60',
			'2e4c61f2-4ec8-11e6-8172-e39ecd3b86fc',
		],
	},
	{
		title: 'Emerging Markets',
		articles: [
			'd1e89e0a-37c8-11e6-a780-b48ed7b6126f',
			'1c067b52-1829-11e6-bb7d-ee563a5a1cc1',
			'1d454bb8-435a-11e6-9b66-0712b3873ae1',
			'b9594ce8-2e15-11e6-a18d-a96ab29e3c95',
			'1ae8dade-0245-11e6-99cb-83242733f755',
			'd7c6fa2a-0630-11e6-9b51-0fb5e65703ce',
			'03e8e16c-474b-11e6-8d68-72e9211e86ab',
			'6868a6c8-27b0-11e6-83e4-abc22d5d108c',
			'87ac0208-4e54-11e6-8172-e39ecd3b86fc',
			'7de48224-6b94-11e6-ae5b-a7cc5dd5a28c',
		],
	},
];

function topicIndexOf (contentId) {
	return (array) => indexOf(true)(
		map((topic) => indexOf(contentId)(topic.articles) !== -1)(array)
	);
}

function withoutIndex(index) {
	return (array) => array.slice(0, index).concat(array.slice(index + 1));
}

module.exports = function getCuratedArticles (contentId) {
	const currentTopicIndex = topicIndexOf(contentId)(sampleArticles);
	const articlesWithoutCurrent = map((topic) => {
		return ({
		title: topic.title,
		articles: without([contentId])(topic.articles)
	})})(sampleArticles);
	const articlesToFetch = flatten(map(get('articles'))(articlesWithoutCurrent));
	return api.content({ uuid: articlesToFetch })
		.then((articles) => {
			const mappedArticles = keyBy('id')(articles);
			articles = map((topic) => ({
				title: topic.title,
				articles: map((id) => mappedArticles[id])(topic.articles)
			}))(articlesWithoutCurrent);
			const mainTopic = articles[currentTopicIndex];
			return {
				mainTopic,
				otherTopics: withoutIndex(currentTopicIndex)(articles),
			};
		});
}

module.exports.isSampleArticle = function isSampleArticle (contentId) {
	return topicIndexOf(contentId)(sampleArticles) !== -1;
}
