'use strict';

const Entities = require('html-entities').XmlEntities;

module.exports = function($) {
	const entities = new Entities();
	const matcher = /^https:\/\/next-geebee.ft.com\/image\/v1\/images\/raw\/(.+)\?/;

	const $images = $('img[src]');

	$images.each(i => {
		const $thisImage = $images.eq(i);
		const externalURI = $thisImage.attr('src').match(matcher);
		if (externalURI) {
			const imageSrc = externalURI[1];
			// also unescape any html entites
			const imageSrcEncoded = encodeURIComponent(entities.decode(imageSrc));
			const imgSrcMatcher = new RegExp(imageSrc.replace('?', '\\?'), 'g');
			$thisImage.attr('src', $thisImage.attr('src').replace(imageSrc, imageSrcEncoded));
			$thisImage.attr('srcset') && $thisImage.attr('srcset', $thisImage.attr('srcset').replace(imgSrcMatcher, imageSrcEncoded));
		}
		return $thisImage;
	});
	return $;
};
