const expect = require('chai').expect;
const tagTitlePrefix = require('../../../../server/controllers/article-helpers/tag-title-prefix');

describe('Tag Title Prefix', () => {

	context('When tag exists', () => {

		const tagAuthor = {taxonomy: 'authors'};
		const tagBrand = {taxonomy: 'brand'};
		const tagSection = {taxonomy: 'sections'};
		const tagGenre = {taxonomy: 'genre'};
		const tagOther = {taxonomy: 'other'};

		it('translates the taxonomy into a title prefix', () => {
			expect(tagTitlePrefix(tagAuthor).title).to.equal('from');
			expect(tagTitlePrefix(tagBrand).title).to.equal('from');
			expect(tagTitlePrefix(tagSection).title).to.equal('in');
			expect(tagTitlePrefix(tagGenre).title).to.equal('');
			expect(tagTitlePrefix(tagOther).title).to.equal('on');
		});

	});

	context('When no tag', () => {

		it('does not break', () => {
			expect(tagTitlePrefix(undefined)).to.be.undefined;
		});

	});
});
