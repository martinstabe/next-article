/*global describe, it*/
"use strict";
var cheerio = require('cheerio');
var expect = require('chai').expect;
var lightSignupTransform = require('../../../server/transforms/light-sign-up');

describe('Light Signup component inside body', function () {

	const lightSignupHtml = '<div class="n-light-signup__container"></div>';

	it('should not do anything if the lightSignUp flag is off', function () {
		var $ = cheerio.load('<p>1</p><p>2</p><p>3</p><p>4</p><p>5</p><p>6</p>');
		lightSignupTransform($, {});
		expect($.html()).to.equal('<p>1</p><p>2</p><p>3</p><p>4</p><p>5</p><p>6</p>');
	});

	it('should insert the component between the fifth and sixth paragraphs', function() {
		var $ = cheerio.load('<p>1</p><p>2</p><p>3</p><p>4</p><p>5</p><p>6</p>');
		lightSignupTransform($, {lightSignUp: true});
		expect($.html()).to.equal(`<p>1</p><p>2</p><p>3</p><p>4</p><p>5</p>${lightSignupHtml}<p>6</p>`);
	});

	it('should not insert the component if there are only five paragraphs', function() {
		var $ = cheerio.load('<p>1</p><img><p>2</p><p>3</p><p>4</p><p>5</p>');
		lightSignupTransform($, {lightSignUp: true});
		expect($.html()).to.equal('<p>1</p><img><p>2</p><p>3</p><p>4</p><p>5</p>');
	});

	it('should move the component later if there is any other element after the fifth paragraph', function() {
		var $ = cheerio.load('<p>1</p><img><p>2</p><p>3</p><p>4</p><p>5</p><img><p>6</p><p>7</p>');
		lightSignupTransform($, {lightSignUp: true});
		expect($.html()).to.equal(`<p>1</p><img><p>2</p><p>3</p><p>4</p><p>5</p><img><p>6</p>${lightSignupHtml}<p>7</p>`);
	});

});
