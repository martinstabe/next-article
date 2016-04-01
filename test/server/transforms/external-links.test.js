/*global describe, it*/
'use strict';

const cheerio = require('cheerio');
const externalLinks = require('../../../server/transforms/external-links');
const expect = require('chai').expect;

describe('External Links', () => {

	it('opens external links in a new tab or window', () => {
		let $ = cheerio.load(
			'<a href="http://www.bloomberg.com/news/articles/2016-04-01/saudi-arabia-plans-2-trillion-megafund-to-dwarf-all-its-rivals">external link</a>'
		);
		const transformed$ = externalLinks($);
		expect(transformed$('a').attr('target')).to.equal('_blank');
	});

	it('opens next ft.com links in the active tab', () => {
		let $ = cheerio.load(
			'<a href="/content/a-2e23260-f0ec-11e5-aff5-19b4e253664a">next ft.com link</a>'
		);
		const transformed$ = externalLinks($);
		expect(transformed$('a').attr('target')).to.not.exist;
	});

	it('opens ft.com links in the active tab', () => {
		let $ = cheerio.load(
			'<a href="http://www.ft.com/eu-referendum">classic ft.com link</a>'
		);
		const transformed$ = externalLinks($);
		expect(transformed$('a').attr('target')).to.not.exist;
	});

	it('opens on.ft.com links in the active tab', () => {
		let $ = cheerio.load(
			'<a href="http://on.ft.com/11pi2xH3">on.ft.com link</a>'
		);
		const transformed$ = externalLinks($);
		expect(transformed$('a').attr('target')).to.not.exist;
	});
});
