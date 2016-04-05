'use strict';

const figureVariant = require('../../transforms/figure-variant');
const externalImagesEncoding = require('../../transforms/external-images-encoding');
const cheerio = require('cheerio');

module.exports = (mainImage) => {
	// HACK to stop square / portrait images being too big
	const maxImageHeight = 394 // height of a 700 width image with 16:9 aspect ratio
	const ratio = mainImage.height / mainImage.width;
	if (ratio > 0.75 && mainImage.height > 394) {
		mainImage.height = maxImageHeight;
		mainImage.width = maxImageHeight * ratio;
	}

	const mainImageHtml =
	'<figure class="n-content-image">' +
	`<img src="${mainImage.url}" alt="${mainImage.title}" width="${mainImage.width}" height="${mainImage.height}">` +
	'</figure>';

	let $mainImageHtml = cheerio.load(mainImageHtml);
	$mainImageHtml = figureVariant($mainImageHtml);
	return externalImagesEncoding($mainImageHtml).html();
}
