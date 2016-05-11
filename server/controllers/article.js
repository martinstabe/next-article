'use strict';

const logger = require('@financial-times/n-logger').default;
const genericContentTransform = require('ft-n-content-transform').transformAll;
const applicationContentTransform = require('../transforms/body');
const articleBranding = require('ft-n-article-branding');
const suggestedHelper = require('./article-helpers/suggested');
const readNextHelper = require('./article-helpers/read-next');
const decorateMetadataHelper = require('./article-helpers/decorate-metadata');
const openGraphHelper = require('./article-helpers/open-graph');
const bylineTransform = require('../transforms/byline');
const getMoreOnTags = require('./article-helpers/get-more-on-tags');
const getAdsLayout = require('../utils/get-ads-layout');

function isCapiV1(article) {
	return article.provenance.find(
			source => source.includes('http://api.ft.com/content/items/v1/')
	);
}

function isCapiV2(article) {
	return article.provenance.find(
		source => source.includes('http://api.ft.com/enrichedcontent/')
	);
}

function transformArticleBody(body, flags, options) {
	const articleBody = genericContentTransform(body, flags);
	return applicationContentTransform(articleBody, flags, options);
}

function isUserSignedIn(req) {
	return !!req.header('ft-session-token')
}

function isFreeArticle(webUrl) {
	console.log(webUrl, webUrl.search('/cms/s/2') !== -1);
	return webUrl.search('/cms/s/2') !== -1
}

module.exports = function articleV3Controller(req, res, next, content) {
	let asyncWorkToDo = [];

	content.thisYear = new Date().getFullYear();

	content.adsLayout = getAdsLayout(req.query.adsLayout, res.locals.flags);

	if (req.query.myftTopics) {
		content.myftTopics = req.query.myftTopics.split(',');
	}

	//When a user comes to an article from a myFT promo area, we want to push them to follow the topic they came from
	if (req.query.tagToFollow) {
		content.tagToFollow = req.query.tagToFollow;
	}

	// Decorate article with primary tags and tags for display
	decorateMetadataHelper(content);
	content.isSpecialReport = content.primaryTag && content.primaryTag.taxonomy === 'specialReports';

	// If no bodyHTML, revert to using bodyXML
	const contentToTransform = content.bodyHTML || content.bodyXML;

	// Apply content and article specific transforms to bodyHTML
	if (contentToTransform) {
		Object.assign(content, transformArticleBody(contentToTransform, res.locals.flags, {
				fragment: req.query.fragment,
				adsLayout: content.adsLayout,
				metadata: {
					primarySection: content.primarySection || null
				}
			}
		));
	}

	content.designGenre = articleBranding(content.metadata);

	// Decorate with related stuff
	content.moreOns = getMoreOnTags(content.primaryTheme, content.primarySection, content.primaryBrand);

	content.articleV1 = isCapiV1(content);
	content.articleV2 = isCapiV2(content);

	// TODO: move this to template or re-name subheading
	content.standFirst = content.summaries ? content.summaries[0] : '';

	content.byline = bylineTransform(content.byline, content.metadata.filter(item => item.taxonomy === 'authors'));

	content.dehydratedMetadata = {
		moreOns: content.moreOns,
		package: content.storyPackage || [],
	};

	if (res.locals.flags.openGraph) {
		openGraphHelper(content);
	}

	if (res.locals.flags.articleSuggestedRead && content.metadata.length) {
		let storyPackageIds = (content.storyPackage || []).map(story => story.id);

		asyncWorkToDo.push(
			suggestedHelper(content.id, storyPackageIds, content.primaryTag).then(
				articles => content.readNextArticles = articles
			)
		);

		asyncWorkToDo.push(
			readNextHelper(content.id, storyPackageIds, content.primaryTag, content.publishedDate).then(
				article => content.readNextArticle = article
			)
		);

		content.readNextTopic = content.primaryTag;
	}

	if (req.get('FT-Labs-Gift') === 'GRANTED') {
		content.shared = true;
		res.vary('FT-Labs-Gift');
	}

	content.signedIn = isUserSignedIn(req);
	content.freeArticle = isFreeArticle(content.webUrl);

	return Promise.all(asyncWorkToDo)
		.then(() => {
			content.contentType = 'article';
			if (req.query.fragment) {
				res.render('fragment', content);
			} else {
				content.layout = 'wrapper';
				res.render('content', content);
			}
		})
		.catch(error => {
			logger.error(error);
			next(error);
		});
};
