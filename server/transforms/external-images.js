'use strict';

const cheerio = require('cheerio');

module.exports = function($) {

	const $imgs = $('img');

	$imgs.replaceWith(i => {
		let $el = cheerio($imgs.eq(i)).clone();

		const width = $el.attr('width');
		const height = $el.attr('height');

		let maxWidth;

		if (width < height && width > 350 && width < 600) {
			maxWidth = 350;
		} else if (width && width < 700) {
			maxWidth = width;
		} else {
			maxWidth = 700;
		}

		// clean up the img tag and use the image service
		$el.removeAttr('width');
		$el.removeAttr('height');

		// use the image service
		const resize = (url, width) => `https://next-geebee.ft.com/image/v1/images/raw/${url}?source=next&fit=scale-down&width=${width}`;
		const imageUrl = $el.attr('src');
		const imageWidth = (width && width < maxWidth) ? width : maxWidth;

		$el.attr('src', resize(imageUrl, imageWidth));

		// responsify large images
		if (imageWidth === 700) {
			const sources = [
				`${resize(imageUrl, 980)} 980w`,
				`${resize(imageUrl, 700)} 700w`,
				`${resize(imageUrl, 480)} 480w`,
				`${resize(imageUrl, 320)} 320w`
			];

			$el.attr('srcset', sources.join());

			// Matching o-grid at L breakpoint (8 cols) and default (12 cols)
			// http://w3c.github.io/html/semantics-embedded-content.html#viewport-based-selection
			$el.attr('sizes', '(min-width: 61.25em) 700px, 100vw');
		}

		// add placeholder
		if (width && height) {
			const ratio = (100 / width) * height;
			return `<div class="n-content-image__placeholder" style="padding-top:${ratio}%">` +
						`${$.html($el)}` +
					`</div>`;
		} else {
			return $el;
		}

	});
	return $;
};
