const expect = require('chai').expect;
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const fixture = require('../../fixtures/interactive-graphics');

describe('IG poller', () => {
	let subject;
	let result;
	let stub;

	beforeEach(() => {
		stub = sinon.createStubInstance(require('ft-poller'));

		subject = proxyquire('../../../server/lib/ig-poller', {
			'ft-poller': function () { return stub; }
		});
	});

	describe('#start', () => {
		beforeEach(() => {
			result = subject.start();
		});

		it('kicks off the poller', () => {
			sinon.assert.calledOnce(stub.start);
			sinon.assert.calledWith(stub.start, sinon.match.has('initialRequest'));
		});
	});

	describe('#getData', () => {
		beforeEach(() => {
			stub.getData.returns(fixture);
			result = subject.getData();
		});

		it('fetches data from the poller', () => {
			sinon.assert.calledOnce(stub.getData);
			expect(result).to.equal(fixture);
		});
	});
});
