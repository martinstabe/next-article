"use strict";

const cheerio = require('cheerio');

const replaceEllipses = require('./replace-ellipses');
const trimmedLinks = require('./trimmed-links');
const dataTrackable = require('./data-trackable');
const externalImagesEncoding = require('./external-images-encoding');
const figureVariant = require('./figure-variant');
const relatedBoxExpander = require('./related-box-expander');
const tableOfContents = require('./table-of-contents');
const videoPlaceholder = require('./video-placeholder');
const videoBrightcove = require('./video-brightcove');
const extractMainImageAndToc = require('./extract-main-image-and-toc');
const inlineAd = require('./inline-ad');
const externalLinks = require('./external-links');
const lightSignup = require('./light-sign-up');

let transform = function ($, flags, adsLayout) {
	let withFn = function ($, transformFn) {
		let transformed$ = transformFn($, flags, adsLayout);
		return {
			'with': withFn.bind(withFn, transformed$),
			get: function () {
				return transformed$;
			}
		};
	};
	return {
		'with': withFn.bind(withFn, $)
	};
};

module.exports = function (body, flags, adsLayout) {
	body = replaceEllipses(body);
	body = body.replace(/<\/a>\s+([,;.:])/mg, '</a>$1');
	body = body.replace(/http:\/\/www\.ft\.com\/ig\//g, '/ig/');
	body = body.replace(/http:\/\/ig\.ft\.com\//g, '/ig/');

	let $ = transform(cheerio.load(body, { decodeEntities: false }), flags, adsLayout)
		// other transforms
		.with(trimmedLinks)
		.with(dataTrackable)
		.with(videoPlaceholder)
		.with(videoBrightcove)
		.with(figureVariant)
		.with(externalImagesEncoding)
		.with(relatedBoxExpander)
		.with(tableOfContents)
		.with(inlineAd)
		.with(externalLinks)
		.with(lightSignup)
		.get();

	return extractMainImageAndToc($);
};
