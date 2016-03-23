/*global describe, context, it*/
'use strict';

const cheerio = require('cheerio');
const externalImagesTransform = require('../../../server/transforms/figure-variant');
const chai = require('chai');
const assert = chai.assert;

describe('Figure Variant Transform', () => {

	context('Size variants and max widths', () => {

		it('applies thin variation when source image width is very small', () => {
			let $ = cheerio.load(
				'<figure class="n-content-image">' +
					'<img src="http://my-image/image.jpg" width="100" height="160">' +
				'</figure>'
			);

			$ = cheerio.load(externalImagesTransform($).html());

			assert.strictEqual($('figure').hasClass('n-content-image--thin'), true);
		});


		it('applies inline variation when source image is small', () => {
			let $ = cheerio.load(
				'<figure class="n-content-image">' +
					'<img src="http://my-image/image.jpg" width="320" height="240">' +
				'</figure>'
			);

			$ = cheerio.load(externalImagesTransform($).html());

			assert.strictEqual($('figure').hasClass('n-content-image--inline'), true);
		});

		it('applies center variation when source image is neither small nor large', () => {
			let $ = cheerio.load(
				'<figure class="n-content-image">' +
					'<img src="http://my-image/image.jpg" width="640" height="480">' +
				'</figure>'
			);

			$ = cheerio.load(externalImagesTransform($).html());

			assert.strictEqual($('figure').hasClass('n-content-image--center'), true);
		});

		it('applies full width, maximum size variation when source image is large', () => {
			let $ = cheerio.load(
				'<figure class="n-content-image">' +
					'<img src="http://my-image/image.jpg" width="1600" height="960">' +
				'</figure>'
			);

			$ = cheerio.load(externalImagesTransform($).html());

			assert.strictEqual($('figure').hasClass('n-content-image--full'), true);
		});

		it('applies inline variation when source image is portrait and is less than 600px wide', () => {
			let $ = cheerio.load(
				'<figure class="n-content-image">' +
					'<img src="http://my-image/image.jpg" width="400" height="800">' +
				'</figure>'
			);

			$ = cheerio.load(externalImagesTransform($).html());

			assert.strictEqual($('figure').hasClass('n-content-image--inline'), true);
		});

		it('applies center variation when source image is portrait and width is between 600px and 700px', () => {
			let $ = cheerio.load(
				'<figure class="n-content-image">' +
					'<img src="http://my-image/image.jpg" width="600" height="1200">' +
				'</figure>'
			);
			$ = cheerio.load(externalImagesTransform($).html());

			assert.strictEqual($('figure').hasClass('n-content-image--center'), true);
		});

		it('applies full variation when source image has no dimensions', () => {
			let $ = cheerio.load(
				'<figure class="n-content-image">' +
						'<img src="http://my-image/image.jpg">' +
				'</figure>'
			);

			$ = cheerio.load(externalImagesTransform($).html());

			assert.strictEqual($('figure').hasClass('n-content-image--full'), true);
		});

		it('sets the width style as 350px when source image is portrait and the width is between 350px and 600px', () => {
			let $ = cheerio.load(
				'<figure class="n-content-image">' +
					'<img src="http://my-image/image.jpg" width="400" height="450">' +
				'</figure>'
			);

			$ = cheerio.load(externalImagesTransform($).html());

			assert.strictEqual($('figure').css('width'), '350px');
		});

		it('sets the width style as the source image width when source image width is less than 700px', () => {
			let $ = cheerio.load(
				'<figure class="n-content-image">' +
					'<img src="http://my-image/image.jpg" width="100" height="160">' +
				'</figure>'
			);

			$ = cheerio.load(externalImagesTransform($).html());

			assert.strictEqual($('figure').css('width'), '100px');
		});

		it('sets the width style as 700px when source image width is greater than 700px', () => {
			let $ = cheerio.load(
				'<figure class="n-content-image">' +
					'<img src="http://my-image/image.jpg" width="700" height="500">' +
				'</figure>'
			);

			$ = cheerio.load(externalImagesTransform($).html());

			assert.strictEqual($('figure').css('width'), '700px');
		});

		it('sets the width style as 700px when source image has no width attribute', () => {
			let $ = cheerio.load(
				'<figure class="n-content-image">' +
					'<img src="http://my-image/image.jpg">' +
				'</figure>'
			);

			$ = cheerio.load(externalImagesTransform($).html());

			assert.strictEqual($('figure').css('width'), '700px');
		});

	});

});
