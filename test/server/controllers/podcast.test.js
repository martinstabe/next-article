const sinon = require('sinon');
const expect = require('chai').expect;
const proxyquire = require('proxyquire');
const httpMocks = require('node-mocks-http');

const fixture = require('../../fixtures/v3-elastic-podcast-found').docs[0]._source;

const stubs = {
	suggested: sinon.stub(),
	readNext: sinon.stub()
};

const subject = proxyquire('../../../server/controllers/podcast', {
	'./article-helpers/suggested': stubs.suggested,
	'./article-helpers/read-next': stubs.readNext
});

describe('Podcast Controller', () => {
	let request;
	let response;
	let next;
	let result;

	function createInstance (params, flags) {
		next = sinon.stub();
		request = httpMocks.createRequest(params);
		response = httpMocks.createResponse();
		response.locals = { flags: flags || {} };

		// node-mocks-http doesn't support this method
		response.unvaryAll = sinon.stub();

		return subject(request, response, next, fixture);
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

		it('provides related data for podcasts', () => {
			expect(result.externalLinks).to.be.an('object');
			expect(result.externalLinks).to.include.keys('itunes', 'stitcher', 'audioboom');

			expect(result.media).to.be.an('object');
			expect(result.media).to.include.keys('mediaType', 'url');
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
