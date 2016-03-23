"use strict"

module.exports = function($) {

	const $figures = $('figure');

	$figures.each(i => {
		let $el = $figures.eq(i);

		const imageEl = $el.find('img');
		const width = imageEl.attr('width');
		const height = imageEl.attr('height');

		let variant;
		let maxWidth;

		// positioning variant
		if (width && width < 150) {
			variant = "thin";
		} else if (width && width < 350 || ((width < height) && width < 600)) {
			variant = "inline";
		} else if (width && width < 700) {
			variant = "center";
		} else {
			variant = "full";
		}

		// Unable to shrink wrap the contents so inline styles are needed
		if (width < height && width > 350 && width < 600) {
			maxWidth = 350;
		} else if (width && width < 700) {
			maxWidth = width;
		} else {
			maxWidth = 700;
		}

		$el.css({'width': maxWidth + 'px', 'max-width': '100%'});
		$el.addClass(`n-content-image--${variant}`);

	});
	return $;
};
