/*global describe, context, it, beforeEach */

'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;
const proxyquire = require('proxyquire');
const httpMocks = require('node-mocks-http');

const fixture = require('../../fixtures/v3-elastic-article-found').docs[0]._source;
const fixturePremium = require('../../fixtures/v3-elastic-article-found-premium').docs[0]._source;

const stubs = {
	suggested: sinon.stub(),
	readNext: sinon.stub()
};

const subject = proxyquire('../../../server/controllers/article', {
	'./article-helpers/suggested': stubs.suggested,
	'./article-helpers/read-next': stubs.readNext,
	'../transforms/body': (articleHtml) => { return { html: () => articleHtml } },
	'../transforms/byline': data => data
});

describe('Article Controller', () => {

	let request;
	let response;
	let next;
	let result;

	function createInstance (params, flags, payload) {
		next = sinon.stub();
		request = httpMocks.createRequest(params);
		response = httpMocks.createResponse();
		response.locals = { flags: flags || {} };

		// node-mocks-http doesn't support this method
		response.unvaryAll = sinon.stub();

		return subject(request, response, next, payload || fixture);
	}

	context('success', () => {
		beforeEach(() => {
			stubs.suggested.returns(Promise.resolve());
			stubs.readNext.returns(Promise.resolve());

			result = null;

			return createInstance(null, { articleSuggestedRead: true }).then(() => {
				result = response._getRenderData()
			});
		});

		it('returns a successful response', () => {
			expect(next.callCount).to.equal(0);
			expect(response.statusCode).to.equal(200);
		});

		it('maps data for compatibility with legacy templates', () => {
			expect(result.standFirst).to.not.be.undefined;
		});

		it('provides more on data for related content', () => {
			expect(result.moreOns.length).to.equal(2);

			result.moreOns.forEach(
				tag => expect(tag).to.include.keys('title', 'url')
			);
		});

		it('provides dehydrated metadata for related content', () => {
			expect(result.dehydratedMetadata).to.include.keys('moreOns', 'package');

			result.dehydratedMetadata.moreOns.forEach(
				tag => expect(tag).to.include.keys('id', 'name', 'taxonomy')
			);

			expect(result.dehydratedMetadata.moreOns[0].id).to.equal('M2Y3OGJkYjQtMzQ5OC00NTM2LTg0YzUtY2JmNzZiY2JhZDQz-VG9waWNz');
			expect(result.dehydratedMetadata.moreOns[1].id).to.equal('NTg=-U2VjdGlvbnM=');
			expect(result.dehydratedMetadata.package).to.be.an.instanceOf(Array);
		});

		it('adds premiumArticle=true if article is premium', () => {
			return createInstance(null, { openGraph: true }, fixturePremium).then(() => {
				let result = response._getRenderData()
				expect(result.premiumArticle).to.equal(true);
			});
		});

		it('adds premiumArticle=false if article is not premium', () => {
			expect(result.premiumArticle).to.equal(false);
		});
	});

	context('fragment layout', () => {
		beforeEach(() => {
			result = null;

			return createInstance({ query: { fragment: 1 } }).then(() => {
				result = response._getRenderData()
			});
		});

		it('renders supports rendering with fragment layout', () => {
			expect(response._getRenderView()).to.equal('fragment');
		});
	});

	context('suggestions fail', () => {
		beforeEach(() => {
			stubs.suggested.returns(Promise.reject());
			stubs.readNext.returns(Promise.reject());

			result = null;

			return createInstance(null, { articleSuggestedRead: true }).then(() => {
				result = response._getRenderData()
			});
		});

		it('returns a 50x', () => {
			expect(next.callCount).to.equal(1);
		});
	});
});
