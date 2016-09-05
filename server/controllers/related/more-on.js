'use strict';

const api = require('next-ft-api-client');
const fetchres = require('fetchres');
const logger = require('@financial-times/n-logger').default;
const NoRelatedResultsException = require('../../lib/no-related-results-exception');
const articleModel = require('ft-n-content-model');
const ReactServer = require('react-dom/server');
const React = require('react');
const getSection = require('../../../config/sections');
const Section = require('@financial-times/n-section').Section;


const getArticles = (tagId, count, parentId) => {
	return api.search({
		filter: [ 'metadata.idV1', tagId ],
		// Get +1 for de-duping parent article
		count: count + 1
	})
		.then(articles => {
			if (!articles.length) {
				throw new NoRelatedResultsException();
			}
			return articles
				.filter(article => article.id !== parentId)
				.slice(0, count)
		});
};

const allSettled = (promises) => {
	let resolveWhenSettled = function(promise) {
		return new Promise(res => {
			promise.then(res, () => res());
		});
	};
	return Promise.all(promises.map(resolveWhenSettled));
};

module.exports = function (req, res, next) {

	res.unvaryAll('wrapper');

	// make sure there are tag ids and an index not greater than 4
	if (!req.query.tagIds || !req.query.index || parseInt(req.query.index, 10) > 4) {
		return res.status(400).end();
	}

	const tagIdArray = req.query.tagIds.split(',');
	const moreOnIndex = req.query.index;
	const parentId = req.params.id;
	const count = Math.min(parseInt(req.query.count, 10), 10) || 5;

	let getArticlesPromises = [];
	let precedingMoreOnIds = [];

	const dedupe = function(articlesToDedupe) {
		return !articlesToDedupe
			? []
			: articlesToDedupe.filter(article => isNotADupe(article.id)).slice(0, count);
	};

	const isNotADupe = function(articleId) {
		return precedingMoreOnIds.indexOf(articleId) === -1;
	};

	// get predecessor more-on tag articles for deduping
	tagIdArray.slice(0,(moreOnIndex + 1)).forEach((tagId, i) => {
		getArticlesPromises.push(getArticles(tagId, count * (i + 1), parentId));
	});

	return allSettled(getArticlesPromises)
		.then(moreOnArticlesArray => {
			for (let i = 0; i < moreOnIndex; i++) {
				precedingMoreOnIds = precedingMoreOnIds
				.concat(dedupe(moreOnArticlesArray[i]).map(article => article.id));
			}
			moreOnArticlesArray[moreOnIndex] = dedupe(moreOnArticlesArray[moreOnIndex])
				.map(article => articleModel(article, {useCase: 'article-card'}));

				const sectionProps = getSection(
					'pyramid-trio',
					{content: moreOnArticlesArray[moreOnIndex]},
					res.locals.flags,
					{trackScrollEvent: `more-on-${moreOnIndex}`}
				);
				const sectionHtml = ReactServer.renderToStaticMarkup(<Section {...sectionProps} />);

			return res.send(sectionHtml);

		})
		.catch(function(err) {
			logger.error(err);

			if(err.name === NoRelatedResultsException.NAME) {
				res.status(200).end();
			} else if (err instanceof fetchres.ReadTimeoutError) {
				res.status(500).end();
			} else if (fetchres.originatedError(err)) {
				res.status(404).end();
			} else {
				next(err);
			}
		});
};
