const getMoreOnTags = require('../../../../server/controllers/article-helpers/get-more-on-tags');

const authorTag = {taxonomy: 'authors'};
const brandTag = {taxonomy: 'brand'};
const sectionsTag = {taxonomy: 'sections'};
const genreTag = {taxonomy: 'genre'};

describe('Getting the tags for More Ons', () => {

	it('should return the first two tags if three provided', () => {
		getMoreOnTags(authorTag, brandTag, sectionsTag).length.should.eql(2);
	});

	it('should only return one if only one is provided', () => {
		getMoreOnTags(undefined, genreTag, undefined).length.should.eql(1);
	});

});
