/*global describe, context, it, beforeEach */

'use strict';

const expect = require('chai').expect;
const podcastMainImageHtml = require('../../../../server/controllers/article-helpers/podcast-main-image');
const mainImage = {
	title: 'This is the title',
	description: '',
	url: 'http://image.jpg',
	width: 394,
	height: 394
}

describe('Podcast Main Image', () => {

	const validImageHtml =
		'<figure class="n-content-image n-content-image--center" style="width: 394px; max-width: 100%;">' +
			'<div class="n-content-image__placeholder" style="padding-top:100%">' +
				'<img src="https://next-geebee.ft.com/image/v1/images/raw/http%3A%2F%2Fimage.jpg?source=next&amp;fit=scale-down&amp;width=394" alt="This is the title">' +
			'</div>' +
		'</figure>';

	it('returns the html for the podcast main image', () => {
		expect(podcastMainImageHtml(mainImage)).to.equal(validImageHtml);
	});

});
