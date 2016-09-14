const sinon = require('sinon');
const expect = require('chai').expect;
const httpMocks = require('node-mocks-http');
const subject = require('../../../server/controllers/interactive');

describe('Interactive Controller', () => {
	let request;
	let response;
	let next;

	function createInstance (payload) {
		next = sinon.stub();
		request = httpMocks.createRequest();
		response = httpMocks.createResponse();
		return subject(request, response, next, payload);
	}

	context('embed', () => {
		beforeEach(() => {
			createInstance({
				displaytype: 'embed'
			});
		});

		it('returns a successful response', () => {
			expect(next.callCount).to.equal(0);
			expect(response.statusCode).to.equal(200);
		});

		it('suppplies data to the template', () => {
			expect(response._getRenderData().interactiveUrl).to.be.defined;
		});
	});

	context('redirect', () => {
		beforeEach(() => {
			createInstance({
				displaytype: 'redirect',
				interactiveurl: 'http://ft.com/ig'
			});
		});

		it('returns a successful response', () => {
			expect(next.callCount).to.equal(0);
			expect(response.statusCode).to.equal(302);
		});

		it('redirects to the given URL', () => {
			expect(response._getRedirectUrl()).to.equal('http://ft.com/ig');
		})
	});
});
