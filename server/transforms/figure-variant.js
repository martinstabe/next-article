"use strict"

module.exports = function($) {

	const $images = $('img');
	let figureEl;
	let imageEl;
	let width;
	let height;
	let maxWidth;

	function setPosition() {
		let variant;
		if (width && width < 150) {
			variant = "thin";
		} else if (width && width < 350 || ((width < height) && width < 600)) {
			variant = "inline";
		} else if (width && width < 700) {
			variant = "center";
		} else {
			variant = "full";
		}
		figureEl.addClass(`n-content-image--${variant}`);
	}

	function setWidth() {
		// Unable to shrink wrap the contents so inline styles are needed
		if (width < height && width > 350 && width < 600) {
			maxWidth = 350;
		} else if (width && width < 700) {
			maxWidth = width;
		} else {
			maxWidth = 700;
		}

		figureEl.css({'width': maxWidth + 'px', 'max-width': '100%'});
	}

	function replaceImgAttributes() {
		const resize = (url, width) => `https://next-geebee.ft.com/image/v1/images/raw/${url}?source=next&fit=scale-down&width=${width}`;
		const imageUrl = imageEl.attr('src');
		const imageWidth = (width && width < maxWidth) ? width : maxWidth;

		imageEl.removeAttr('width');
		imageEl.removeAttr('height');
		imageEl.attr('src', resize(imageUrl, imageWidth));

		// responsify large images
		if (imageWidth === 700) {
			const sources = [
				`${resize(imageUrl, 700)} 700w`,
				`${resize(imageUrl, 500)} 500w`,
				`${resize(imageUrl, 300)} 300w`
			];

			imageEl.attr('srcset', sources.join());

			// Matching o-grid at L breakpoint (8 cols) and default (12 cols)
			// http://w3c.github.io/html/semantics-embedded-content.html#viewport-based-selection
			imageEl.attr('sizes', '(min-width: 76.25em) 680px, (min-width: 61.25em) 620px, (min-width: 46.25em) 700px, calc(100vw - 20px)');
		}
	}

	function createPlaceholder() {
		if (width && height) {
			const ratio = (100 / width) * height;

			imageEl.replaceWith(`<div class="n-content-image__placeholder" style="padding-top:${ratio}%">` +
						`${$.html(imageEl)}` +
					`</div>`);
		}
	}

	$images.each(i => {
		imageEl = $images.eq(i);
		figureEl = imageEl.parent('figure');
		width = imageEl.attr('width');
		height = imageEl.attr('height');

		if(figureEl) {
			setPosition();
			setWidth();
		}
		replaceImgAttributes();
		createPlaceholder();

		return figureEl ? figureEl : imageEl;
	});

	return $;
};
