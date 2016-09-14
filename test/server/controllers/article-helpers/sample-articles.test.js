const sinon = require('sinon');
const expect = require('chai').expect;
const proxyquire = require('proxyquire');

const stubs = {
	content: null,
	search: null
};

const sampleArticles = proxyquire('../../../../server/controllers/article-helpers/sample-articles', {
	'next-ft-api-client': stubs,
	'../../mappings/article-pod-mapping-v3': (article) => article
});

describe('Sample Articles', () => {

	describe('isSampleArticle', () => {

		it('returns true if given an article in the sample set', () => {
			expect(sampleArticles.isSampleArticle('c5c01bee-22c4-11e6-aa98-db1e01fabc0c')).to.equal(true);
			expect(sampleArticles.isSampleArticle('42eca2b6-3d4d-11e6-8716-a4a71e8140b0')).to.equal(true);
			expect(sampleArticles.isSampleArticle('7bd05b02-4344-11e6-9b66-0712b3873ae1')).to.equal(true);
		});

		it('returns false if given an article not in the sample set', () => {
			expect(sampleArticles.isSampleArticle('97c592d8-5c93-11e6-bb77-a121aa8abd95')).to.equal(false);
			expect(sampleArticles.isSampleArticle('0d050f1c-5eef-11e6-a72a-bd4bf1198c63')).to.equal(false);
			expect(sampleArticles.isSampleArticle('2e44d82e-5d55-11e6-a72a-bd4bf1198c63')).to.equal(false);
		});

	});

	describe('main function', () => {

		before(function () {
			stubs.content = sinon.stub().returns(
				Promise.resolve([
					{
						id: 'c5c01bee-22c4-11e6-aa98-db1e01fabc0c',
						publishedDate: '2015-09-10T17:18:07.000Z'
					},
					{
						id: '1dbd8c60-0cc6-11e6-ad80-67655613c2d6',
						publishedDate: '2015-09-10T17:18:07.000Z'
					},
					{
						id: 'e9baebee-0bd8-11e6-9456-444ab5211a2f',
						publishedDate: '2015-09-10T17:18:07.000Z'
					},
					{
						id: 'd1e89e0a-37c8-11e6-a780-b48ed7b6126f',
						publishedDate: '2015-09-10T17:18:07.000Z'
					},
				])
			);
		});

		it('returns a promise', () => {
			expect(sampleArticles('c5c01bee-22c4-11e6-aa98-db1e01fabc0c')).to.be.a('promise');
		});

		it('returns object with `mainTopic` matching article id', () =>
			sampleArticles('c5c01bee-22c4-11e6-aa98-db1e01fabc0c').then((response) => {
				expect(response).to.have.property('mainTopic').that.is.an('object').with.property('title', 'US Election and Economy')
			})
		);

		it('returns object with `otherTopics` array without article topic', () =>
			sampleArticles('c5c01bee-22c4-11e6-aa98-db1e01fabc0c').then((response) => {
				expect(response).to.have.property('otherTopics').that.is.an('array');
				expect(response).to.have.deep.property('otherTopics[0].title', 'Xi\'s China');
				expect(response).to.have.deep.property('otherTopics[1].title', 'Asia Pacific Economy and Politics');
				expect(response).to.have.deep.property('otherTopics[2].title', 'Emerging Markets');
			})
		);


	});

});
