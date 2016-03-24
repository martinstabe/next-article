/*global describe, it*/
'use strict';

const cheerio = require('cheerio');
const externalImagesTransform = require('../../../server/transforms/external-images');
const expect = require('chai').expect;

describe('External Images Transform', () => {

	context('Placeholding the image', () => {

		it('adds a placeholder based on aspect ratio', () => {
			const $ = cheerio.load(
				'<img src="http://my-image/image.jpg" width="800" height="600" alt="Lorem ipsum">'
			);

			externalImagesTransform($);

			expect($('div').length).to.equal(1);
			expect($('div').css('padding-top')).to.equal('75%');
		});

		it('does not add a placeholder if the height and width is not known', () => {
			const $ = cheerio.load(
				'<img src="http://my-image/image.jpg" alt="Lorem ipsum">'
			);

			externalImagesTransform($);

			expect($('div').length).to.equal(0);
		});

	});

	context('Using the image service', () => {

		it('transforms the src to use the image service', () => {
			const $ = cheerio.load(
				'<img src="http://my-image/image.jpg" alt="Lorem ipsum">'
			);

			externalImagesTransform($);

			const result = $('img').attr('src');

			expect(result).to.match(/https?:\/\/next-geebee\.ft\.com/);
			expect(result).to.match(/width=700/);
		});

	});

	context('Responsive images', () => {

		it('adds the srcset and sizes attributes for large images', () => {
			const $ = cheerio.load(
				'<img src="http://my-image/image.jpg" width="1600" height="800" alt="Lorem ipsum">'
			);

			externalImagesTransform($);

			expect($('img').attr('srcset')).to.be.a('string');
			expect($('img').attr('sizes')).to.be.a('string');
		});

		it('does not add the sizes or srcset attributes for small images', () => {
			const $ = cheerio.load(
				'<img src="http://my-image/image.jpg" width="640" height="480" alt="Lorem ipsum">'
			);

			externalImagesTransform($);

			expect($('img').attr('srcset')).to.be.undefined;
			expect($('img').attr('sizes')).to.be.undefined;
		});

		it('specifies extra size variations for the image', () => {
			const $ = cheerio.load(
				'<img src="http://my-image/image.jpg" width="1600" height="800" alt="Lorem ipsum">'
			);

			externalImagesTransform($);

			const result = $('img').attr('srcset').split(',');

			expect(result.length).to.equal(4);

			result.forEach((item) => {
				expect(item).to.match(/width=\d{3} \d{3}w/);
			});
		});

	});

});
