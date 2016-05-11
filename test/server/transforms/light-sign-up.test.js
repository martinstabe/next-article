/*global describe, it*/
'use strict';
const cheerio = require('cheerio');
const expect = require('chai').expect;
const lightSignupTransform = require('../../../server/transforms/light-sign-up');

describe('Light Signup component inside body', function () {

	const defaultOptions = {metadata: { primarySection: null}};
	const lightSignupHtml = '<div class="n-light-signup__container" data-n-light-signup-section-id="default" data-n-light-signup-section-pref-label="default"></div>';

	describe('CONTROL variant', function () {

		const flags = {lightSignUp: 'control'};

		it('should not do anything', () => {
			const $ = cheerio.load('<p>1</p><p>2</p><p>3</p><p>4</p><p>5</p><p>6</p>');
			lightSignupTransform($, flags, defaultOptions);
			expect($.html()).to.equal('<p>1</p><p>2</p><p>3</p><p>4</p><p>5</p><p>6</p>');
		});

	});

	describe('TOP variant', function () {

		let flags = {lightSignUp: 'top'};

		it('should insert the component after the first paragraph', () => {
			const $ = cheerio.load('<p>1</p><p>2</p><p>3</p><p>4</p><p>5</p><p>6</p>');
			lightSignupTransform($, flags, defaultOptions);
			expect($.html()).to.equal(`<p>1</p>${lightSignupHtml}<p>2</p><p>3</p><p>4</p><p>5</p><p>6</p>`);
		});


		it('should not insert the component if there is only one paragraph', () => {
			const $ = cheerio.load('<p>1</p><img>');
			lightSignupTransform($, flags, defaultOptions);
			expect($.html()).to.equal('<p>1</p><img>');
		});

		it('should move the component later if there is any other element after the first paragraph', () => {
			const $ = cheerio.load('<p>1</p><img><p>2</p><p>3</p>');
			lightSignupTransform($, flags, defaultOptions);
			expect($.html()).to.equal(`<p>1</p><img><p>2</p>${lightSignupHtml}<p>3</p>`);
		});

		it('should not add into an aside', () => {
			const $ = cheerio.load('<blockquote><p>1</p></blockquote><p>2</p><p>3</p>');
			lightSignupTransform($, flags, defaultOptions);
			expect($.html()).to.equal(`<blockquote><p>1</p></blockquote><p>2</p>${lightSignupHtml}<p>3</p>`);
		});


	});

	describe('MID variant', function () {

		const flags = {lightSignUp: 'mid'};

		it('should insert the component between the fifth and sixth paragraphs', () => {
			const $ = cheerio.load('<p>1</p><p>2</p><p>3</p><p>4</p><p>5</p><p>6</p>');
			lightSignupTransform($, flags, defaultOptions);
			expect($.html()).to.equal(`<p>1</p><p>2</p><p>3</p><p>4</p><p>5</p>${lightSignupHtml}<p>6</p>`);
		});

		it('should not insert the component if there are only five paragraphs', () => {
			const $ = cheerio.load('<p>1</p><img><p>2</p><p>3</p><p>4</p><p>5</p>');
			lightSignupTransform($, flags, defaultOptions);
			expect($.html()).to.equal('<p>1</p><img><p>2</p><p>3</p><p>4</p><p>5</p>');
		});

		it('should move the component later if there is any other element after the fifth paragraph', () => {
			const $ = cheerio.load('<p>1</p><img><p>2</p><p>3</p><p>4</p><p>5</p><img><p>6</p><p>7</p>');
			lightSignupTransform($, flags, defaultOptions);
			expect($.html()).to.equal(`<p>1</p><img><p>2</p><p>3</p><p>4</p><p>5</p><img><p>6</p>${lightSignupHtml}<p>7</p>`);
		});

		it('should not add into an aside', () => {
			const $ = cheerio.load('<p>1</p><p>2</p><p>3</p><p>4</p><blockquote><p>5</p></blockquote><p>6</p><p>7</p>');
			lightSignupTransform($, flags, defaultOptions);
			expect($.html()).to.equal(`<p>1</p><p>2</p><p>3</p><p>4</p><blockquote><p>5</p></blockquote><p>6</p>${lightSignupHtml}<p>7</p>`);
		});

	});


	describe('END variant', function () {

		const flags = {lightSignUp: 'end'};

		it('should insert the component after the final paragraph', () => {
			const $ = cheerio.load('<p>1</p><p>2</p><p>3</p><p>4</p><p>5</p>');
			lightSignupTransform($, flags, defaultOptions);
			expect($.html()).to.equal(`<p>1</p><p>2</p><p>3</p><p>4</p><p>5</p>${lightSignupHtml}`);
		});

	});

	describe('Fragment view', () => {
		const flags = {lightSignUp: 'mid'};
		const options = {fragment: true};

		it('should not insert anything on a fragment view', () => {
			const $ = cheerio.load('<p>1</p><p>2</p><p>3</p><p>4</p><p>5</p>');
			lightSignupTransform($, flags, options);
			expect($.html()).to.equal('<p>1</p><p>2</p><p>3</p><p>4</p><p>5</p>');
		});
	});

	describe('Specify Mailing List', () => {
		const flags = {lightSignUp: 'top'};

		it('should add data attribute values to the component', () => {
			const $ = cheerio.load('<p>1</p><p>2</p><p>3</p><p>4</p><p>5</p><p>6</p>');
			const options = {metadata: { primarySection: {idV1: 'foo', prefLabel: 'bar'}}};
			const lightSignupHtml = '<div class="n-light-signup__container" data-n-light-signup-section-id="foo" data-n-light-signup-section-pref-label="bar"></div>';
			lightSignupTransform($, flags, options);
			expect($.html()).to.equal(`<p>1</p>${lightSignupHtml}<p>2</p><p>3</p><p>4</p><p>5</p><p>6</p>`);
		});

		it('should only add data attribute values if name and prefLabel are present', () => {
			const $ = cheerio.load('<p>1</p><p>2</p><p>3</p><p>4</p><p>5</p><p>6</p>');
			const options = {metadata: { primarySection: {idV1: 'foo', prefLabel: null}}};
			lightSignupTransform($, flags, options);
			expect($.html()).to.equal(`<p>1</p>${lightSignupHtml}<p>2</p><p>3</p><p>4</p><p>5</p><p>6</p>`);
		});

		it('should use default data attribute values if data missing', () => {
			const $ = cheerio.load('<p>1</p><p>2</p><p>3</p><p>4</p><p>5</p><p>6</p>');
			const options = {metadata: { primarySection: null}};
			lightSignupTransform($, flags, options);
			expect($.html()).to.equal(`<p>1</p>${lightSignupHtml}<p>2</p><p>3</p><p>4</p><p>5</p><p>6</p>`);
		});


	});

});
