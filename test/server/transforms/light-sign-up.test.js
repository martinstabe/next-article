/*global describe, it*/
"use strict";
var cheerio = require('cheerio');
var expect = require('chai').expect;
var lightSignupTransform = require('../../../server/transforms/light-sign-up');

describe('Light Signup component inside body', function () {

	const lightSignupHtml = '<div class="n-light-signup__container"></div>';

	describe('CONTROL variant', function () {

		let flags = {lightSignUp: 'control'};

		it('should not do anything', function () {
			var $ = cheerio.load('<p>1</p><p>2</p><p>3</p><p>4</p><p>5</p><p>6</p>');
			lightSignupTransform($, flags);
			expect($.html()).to.equal('<p>1</p><p>2</p><p>3</p><p>4</p><p>5</p><p>6</p>');
		});

	});

	describe('TOP variant', function () {

		let flags = {lightSignUp: 'top'};

		it('should insert the component after the first paragraph', function() {
			var $ = cheerio.load('<p>1</p><p>2</p><p>3</p><p>4</p><p>5</p><p>6</p>');
			lightSignupTransform($, flags);
			expect($.html()).to.equal(`<p>1</p>${lightSignupHtml}<p>2</p><p>3</p><p>4</p><p>5</p><p>6</p>`);
		});


		it('should not insert the component if there is only one paragraph', function() {
			var $ = cheerio.load('<p>1</p><img>');
			lightSignupTransform($, flags);
			expect($.html()).to.equal('<p>1</p><img>');
		});

		it('should move the component later if there is any other element after the first paragraph', function() {
			var $ = cheerio.load('<p>1</p><img><p>2</p><p>3</p>');
			lightSignupTransform($, flags);
			expect($.html()).to.equal(`<p>1</p><img><p>2</p>${lightSignupHtml}<p>3</p>`);
		});

		it('should not add into an aside', function() {
			var $ = cheerio.load('<blockquote><p>1</p></blockquote><p>2</p><p>3</p>');
			lightSignupTransform($, flags);
			expect($.html()).to.equal(`<blockquote><p>1</p></blockquote><p>2</p>${lightSignupHtml}<p>3</p>`);
		});


	});

	describe('MID variant', function () {

		let flags = {lightSignUp: 'mid'};

		it('should insert the component between the fifth and sixth paragraphs', function() {
			var $ = cheerio.load('<p>1</p><p>2</p><p>3</p><p>4</p><p>5</p><p>6</p>');
			lightSignupTransform($, flags);
			expect($.html()).to.equal(`<p>1</p><p>2</p><p>3</p><p>4</p><p>5</p>${lightSignupHtml}<p>6</p>`);
		});

		it('should not insert the component if there are only five paragraphs', function() {
			var $ = cheerio.load('<p>1</p><img><p>2</p><p>3</p><p>4</p><p>5</p>');
			lightSignupTransform($, flags);
			expect($.html()).to.equal('<p>1</p><img><p>2</p><p>3</p><p>4</p><p>5</p>');
		});

		it('should move the component later if there is any other element after the fifth paragraph', function() {
			var $ = cheerio.load('<p>1</p><img><p>2</p><p>3</p><p>4</p><p>5</p><img><p>6</p><p>7</p>');
			lightSignupTransform($, flags);
			expect($.html()).to.equal(`<p>1</p><img><p>2</p><p>3</p><p>4</p><p>5</p><img><p>6</p>${lightSignupHtml}<p>7</p>`);
		});

		it('should not add into an aside', function() {
			var $ = cheerio.load('<p>1</p><p>2</p><p>3</p><p>4</p><blockquote><p>5</p></blockquote><p>6</p><p>7</p>');
			lightSignupTransform($, flags);
			expect($.html()).to.equal(`<p>1</p><p>2</p><p>3</p><p>4</p><blockquote><p>5</p></blockquote><p>6</p>${lightSignupHtml}<p>7</p>`);
		});

	});


	describe('END variant', function () {

		let flags = {lightSignUp: 'end'};

		it('should insert the component after the final paragraph', function() {
			var $ = cheerio.load('<p>1</p><p>2</p><p>3</p><p>4</p><p>5</p>');
			lightSignupTransform($, flags);
			expect($.html()).to.equal(`<p>1</p><p>2</p><p>3</p><p>4</p><p>5</p>${lightSignupHtml}`);
		});

	});

});
