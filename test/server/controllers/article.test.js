const sinon = require('sinon');
const expect = require('chai').expect;
const proxyquire = require('proxyquire');
const httpMocks = require('node-mocks-http');

const fixture = require('../../fixtures/v3-elastic-article-found').docs[0]._source;
const fixtureBlog = require('../../fixtures/v3-elastic-article-found-blog').docs[0]._source;
const fixtureFastFT = require('../../fixtures/v3-elastic-article-found-fastft').docs[0]._source;
const fixturePremium = require('../../fixtures/v3-elastic-article-found-premium').docs[0]._source;
const fixtureSampleExcluded = require('../../fixtures/sample-article-excluded').docs[0]._source;
const fixtureSampleIncluded = require('../../fixtures/sample-article-included').docs[0]._source;

const stubs = {
	suggested: sinon.stub(),
	readNext: sinon.stub(),
	sampleArticles: sinon.stub(),
};
stubs.sampleArticles.isSampleArticle = sinon.stub();

const subject = proxyquire('../../../server/controllers/article', {
	'./article-helpers/sample-articles': stubs.sampleArticles,
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

		it('has the correct canonical URL for an article', () => {
			expect(result.canonicalUrl).to.equal('https://www.ft.com/content/352210c4-7b17-11e5-a1fe-567b37f80b64');
		});

		it('has the correct canonical URL for a blog', () => {
			return createInstance(null, { openGraph: true }, fixtureBlog).then(() => {
				let result = response._getRenderData()
				expect(result.canonicalUrl).to.equal('http://blogs.ft.com/gavyndavies/2016/09/11/what-investors-should-know-about-r-star/');
			});
		});

		it('has the correct canonical URL for FastFT', () => {
			return createInstance(null, { openGraph: true }, fixtureFastFT).then(() => {
				let result = response._getRenderData()
				expect(result.canonicalUrl).to.equal('http://www.ft.com/fastft/2016/09/13/linde-cfo-denoke-out-a-day-after-praxair-deal-talks-end/');
			});
		});

		it('adds premiumArticle=false if article is not premium', () => {
			expect(result.premiumArticle).to.equal(false);
		});
	});

	context('sample articles', () => {
		const instanceParams = { headers: { 'ft-is-aud-dev': 'true' } };

		context('without anonSampleArticles flag', () => {

			context('on non-sample article', () => {
				beforeEach(() => {
					result = null;
					stubs.sampleArticles.isSampleArticle.reset().returns(false);

					return createInstance(instanceParams, {}, fixtureSampleExcluded).then(() => {
						result = response._getRenderData()
					});
				});

				it('does not render sample articles', () => {
					expect(result).to.not.have.property('sampleArticles');
				});

			});

			context('on sample article', () => {
				beforeEach(() => {
					result = null;
					stubs.sampleArticles.isSampleArticle.reset().returns(true);

					return createInstance(instanceParams, {}, fixtureSampleIncluded).then(() => {
						result = response._getRenderData()
					});
				});

				it('does not render sample articles', () => {
					expect(result).to.not.have.property('sampleArticles');
				});

			});

		});

		context('with anonSampleArticles flag', () => {

			context('on non-sample article', () => {
				beforeEach(() => {
					result = null;
					stubs.sampleArticles.isSampleArticle.reset().returns(false);

					return createInstance(instanceParams, { anonSampleArticles: true }, fixtureSampleExcluded).then(() => {
						result = response._getRenderData()
					});
				});

				it('does not render sample articles', () => {
					expect(result).to.not.have.property('sampleArticles');
				});

			});

			context('on sample article', () => {
				beforeEach(() => {
					result = null;
					stubs.sampleArticles.isSampleArticle.reset().returns(true);
					stubs.sampleArticles.returns(Promise.resolve());

					return createInstance(instanceParams, { anonSampleArticles: true }, fixtureSampleIncluded).then(() => {
						result = response._getRenderData()
					});
				});

				it('does not render sample articles', () => {
					expect(result).to.have.property('sampleArticles');
				});

			});

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
