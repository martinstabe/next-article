/*global describe, it*/
"use strict";
var cheerio = require('cheerio');
var expect = require('chai').expect;
var inlineAdTransform = require('../../../server/transforms/inline-ad');

describe('Inline ad inside body', function () {

	const adHtml = '<div class="o-ads in-article-advert" data-o-ads-name="mpu" data-o-ads-center="true" data-o-ads-label="true" data-o-ads-targeting="pos=mpu;" data-o-ads-formats-default="MediumRectangle,Responsive" data-o-ads-formats-small="MediumRectangle,Responsive" data-o-ads-formats-medium="MediumRectangle,Responsive" data-o-ads-formats-large="Responsive" data-o-ads-formats-extra="Responsive" aria-hidden="true"></div>';

	it('should insert an ad between the third and fourth paragraphs', function() {
		var $ = cheerio.load('<p>1</p><p>2</p><p>3</p><p>4</p>');
		$ = inlineAdTransform($, {}, 'default');
		expect($.html()).to.equal(`<p>1</p><p>2</p><p>3</p>${adHtml}<p>4</p>`);
	});

	it('should not insert an ad if there are only three paragraphs', function() {
		var $ = cheerio.load('<p>1</p><img><p>2</p><p>3</p><img>');
		$ = inlineAdTransform($, {}, 'default');
		expect($.html()).to.equal(`<p>1</p><img><p>2</p><p>3</p><img>`);
	});

	it('should move the ad later if there is any other element after the third paragraph', function() {
		var $ = cheerio.load('<p>1</p><img><p>2</p><p>3</p><img><p>4</p><p>5</p>');
		$ = inlineAdTransform($, {}, 'default');
		expect($.html()).to.equal(`<p>1</p><img><p>2</p><p>3</p><img><p>4</p>${adHtml}<p>5</p>`);
	});

	it('should call the targeting pos "mid" for the new layout', function() {
		var $ = cheerio.load('<p>1</p><img><p>2</p><p>3</p><img><p>4</p><p>5</p>');
		$ = inlineAdTransform($, {}, 'responsive');
		expect($.html()).to.equal(`<p>1</p><img><p>2</p><p>3</p><img><p>4</p>${adHtml.replace("pos=mpu;", "pos=mid;")}<p>5</p>`);
	});

	it('should not place an ad in an aside', function() {
		var $ = cheerio.load('<p>1</p><p>2</p><aside><p>3</p><p>4</p></aside>');
		$ = inlineAdTransform($, {}, 'responsive');
		expect($.html()).to.equal('<p>1</p><p>2</p><aside><p>3</p><p>4</p></aside>');
	});

});
