/*global describe, context, it*/
'use strict';

const cheerio = require('cheerio');
const externalImagesTransform = require('../../../server/transforms/figure-variant');
const chai = require('chai');
const assert = chai.assert;

describe('Figure Variant Transform', () => {

	context('Size variants and max widths', () => {

		it('applies thin variation when source image width is very small', () => {
			const $ = cheerio.load(
				'<figure class="n-content-image">' +
					'<img src="http://my-image/image.jpg" width="100" height="160">' +
				'</figure>'
			);

			externalImagesTransform($);

			assert.strictEqual($('figure').hasClass('n-content-image--thin'), true);
		});


		it('applies inline variation when source image is small', () => {
			const $ = cheerio.load(
				'<figure class="n-content-image">' +
					'<img src="http://my-image/image.jpg" width="320" height="240">' +
				'</figure>'
			);

			externalImagesTransform($);

			assert.strictEqual($('figure').hasClass('n-content-image--inline'), true);
		});

		it('applies center variation when source image is neither small nor large', () => {
			const $ = cheerio.load(
				'<figure class="n-content-image">' +
					'<img src="http://my-image/image.jpg" width="640" height="480">' +
				'</figure>'
			);

			externalImagesTransform($);

			assert.strictEqual($('figure').hasClass('n-content-image--center'), true);
		});

		it('applies full width, maximum size variation when source image is large', () => {
			const $ = cheerio.load(
				'<figure class="n-content-image">' +
					'<img src="http://my-image/image.jpg" width="1600" height="960">' +
				'</figure>'
			);

			externalImagesTransform($);

			assert.strictEqual($('figure').hasClass('n-content-image--full'), true);
		});

		it('applies inline variation when source image is portrait and is less than 600px wide', () => {
			const $ = cheerio.load(
				'<figure class="n-content-image">' +
					'<img src="http://my-image/image.jpg" width="400" height="800">' +
				'</figure>'
			);

			externalImagesTransform($);

			assert.strictEqual($('figure').hasClass('n-content-image--inline'), true);
		});

		it('applies center variation when source image is portrait and width is between 600px and 700px', () => {
			const $ = cheerio.load(
				'<figure class="n-content-image">' +
					'<img src="http://my-image/image.jpg" width="600" height="1200">' +
				'</figure>'
			);
			externalImagesTransform($);

			assert.strictEqual($('figure').hasClass('n-content-image--center'), true);
		});

		it('applies full variation when source image has no dimensions', () => {
			const $ = cheerio.load(
				'<figure class="n-content-image">' +
						'<img src="http://my-image/image.jpg">' +
				'</figure>'
			);

			externalImagesTransform($);

			assert.strictEqual($('figure').hasClass('n-content-image--full'), true);
		});

		it('sets the width style as 350px when source image is portrait and the width is between 350px and 600px', () => {
			const $ = cheerio.load(
				'<figure class="n-content-image">' +
					'<img src="http://my-image/image.jpg" width="400" height="450">' +
				'</figure>'
			);

			externalImagesTransform($);

			assert.strictEqual($('figure').css('width'), '350px');
		});

		it('sets the width style as the source image width when source image width is less than 700px', () => {
			const $ = cheerio.load(
				'<figure class="n-content-image">' +
					'<img src="http://my-image/image.jpg" width="100" height="160">' +
				'</figure>'
			);

			externalImagesTransform($);

			assert.strictEqual($('figure').css('width'), '100px');
		});

		it('sets the width style as 700px when source image width is greater than 700px', () => {
			const $ = cheerio.load(
				'<figure class="n-content-image">' +
					'<img src="http://my-image/image.jpg" width="700" height="500">' +
				'</figure>'
			);

			externalImagesTransform($);

			assert.strictEqual($('figure').css('width'), '700px');
		});

		it('sets the width style as 700px when source image has no width attribute', () => {
			const $ = cheerio.load(
				'<figure class="n-content-image">' +
					'<img src="http://my-image/image.jpg">' +
				'</figure>'
			);

			externalImagesTransform($);

			assert.strictEqual($('figure').css('width'), '700px');
		});

	});

	context('Placeholding the image', () => {
		it('adds a placeholder based on aspect ratio', () => {
			const $ = cheerio.load(
				'<img src="http://my-image/image.jpg" width="800" height="600" alt="Lorem ipsum">'
			);

			externalImagesTransform($);

			assert.strictEqual($('div').length, 1);
			assert.strictEqual($('div').css('padding-top'), '75%');
		});

		it('does not add a placeholder if the height and width is not known', () => {
			const $ = cheerio.load(
				'<img src="http://my-image/image.jpg" alt="Lorem ipsum">'
			);

			externalImagesTransform($);

			assert.strictEqual($('div').length, 0);
		});

	});

	context('Using the image service', () => {

		it('transforms the src to use the image service', () => {
			const $ = cheerio.load(
				'<img src="http://my-image/image.jpg" alt="Lorem ipsum">'
			);

			externalImagesTransform($);

			const result = $('img').attr('src');

			assert.match(result, /https?:\/\/next-geebee\.ft\.com/);
			assert.match(result, /width=700/);
		});

	});

	context('Responsive images', () => {

		it('adds the srcset and sizes attributes for large images', () => {
			const $ = cheerio.load(
				'<img src="http://my-image/image.jpg" width="1600" height="800" alt="Lorem ipsum">'
			);

			externalImagesTransform($);

			assert.isString($('img').attr('srcset'));
			assert.isString($('img').attr('sizes'));
		});

		it('does not add the sizes or srcset attributes for small images', () => {
			const $ = cheerio.load(
				'<img src="http://my-image/image.jpg" width="640" height="480" alt="Lorem ipsum">'
			);

			externalImagesTransform($);

			assert.isUndefined($('img').attr('srcset'));
			assert.isUndefined($('img').attr('sizes'));
		});

		it('specifies extra size variations for the image', () => {
			const $ = cheerio.load(
				'<img src="http://my-image/image.jpg" width="1600" height="800" alt="Lorem ipsum">'
			);

			externalImagesTransform($);

			const result = $('img').attr('srcset').split(',');

			assert.strictEqual(result.length, 4);

			result.forEach((item) => {
				assert.match(item, /width=\d{3} \d{3}w/);
			});
		});
	});
});
