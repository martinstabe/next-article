/*global describe, it*/
"use strict";
var cheerio = require('cheerio');
var expect = require('chai').expect;
var slideshowTransform = require('../../../server/transforms/slideshow');

describe('Slideshow', function () {

	it('should understand slideshows', function() {
		var $ = cheerio.load('<a href="http://www.ft.com/cms/s/0/f3970f88-0475-11df-8603-00144feabdc0.html#slide0"></a>');
		$ = slideshowTransform($);
		expect($.html()).to.equal('<ft-slideshow data-uuid="f3970f88-0475-11df-8603-00144feabdc0" data-syncid="1"></ft-slideshow>');
	});

	it('should move the slideshow before the parent `p`', function () {
		var $ = cheerio.load('<p><a href="http://www.ft.com/cms/s/0/f3970f88-0475-11df-8603-00144feabdc0.html#slide0"></a>A gallery</p>');
		$ = slideshowTransform($);
		expect($.html()).to.equal('<ft-slideshow data-uuid="f3970f88-0475-11df-8603-00144feabdc0" data-syncid="1"></ft-slideshow><p>A gallery</p>');
	});

	it('should only promote links to slideshows to embeds if <a> inner text not empty', function() {
		var $ = cheerio.load('<a href="http://www.ft.com/cms/s/0/f3970f88-0475-11df-8603-00144feabdc0.html#slide0">political turmoil</a>');
		$ = slideshowTransform($);
		expect($.html()).to.equal('<a href="http://www.ft.com/cms/s/0/f3970f88-0475-11df-8603-00144feabdc0.html#slide0">political turmoil</a>');
	});

});
