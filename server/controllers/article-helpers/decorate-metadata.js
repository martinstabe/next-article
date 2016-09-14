const addTagTitlePrefix = require('./tag-title-prefix');

function fillProperties (article) {
	article.metadata = article.metadata.map(tag => {
		let v1 = {
			id: tag.idV1,
			name: tag.prefLabel,
			url: String(tag.url || '').replace('https://www.ft.com', '')
		};

		return Object.assign(tag, v1);
	});
}

function selectPrimaryTheme (article) {
	article.primaryTheme = article.metadata.find(tag => tag.primary === 'theme');
}

function selectPrimarySection (article) {
	article.primarySection = article.metadata.find(tag => tag.primary === 'section');
}

function selectPrimaryBrand (article) {
	article.primaryBrand = article.metadata.find(tag => tag.primary === 'brand');
}

function selectPrimaryTag (article) {
	let precedence = [ 'specialReports' ];
	let primaryTag;

	if (article.primarySection && precedence.indexOf(article.primarySection.taxonomy) > -1) {
		primaryTag = article.primarySection;
	} else {
		primaryTag = article.primaryTheme || article.primarySection || null;
	}

	article.primaryTag = primaryTag;
}

function isPrimaryTag (article) {
	return (tag) => (!article.primaryTag || article.primaryTag.id !== tag.id);
}

function selectTagsMyftTagsForDisplay (article) {
	let myftTopics = article.myftTopics || [];

	return article.metadata
		.filter(isPrimaryTag(article))
		.filter(tag => myftTopics.some(id => id === tag.id))
		.filter(tag => tag.taxonomy !== 'authors');
}

function selectTagsForDisplay (article) {
	let ignore = [ 'genre', 'mediaType', 'iptc', 'icb', 'authors' ];
	let myftTopics = selectTagsMyftTagsForDisplay(article);
	let defaultTopics = article.metadata
		.filter(tag => !myftTopics.some(myftTag => myftTag.id === tag.id))
		.filter(tag => !ignore.find(taxonomy => taxonomy === tag.taxonomy))
		.filter(isPrimaryTag(article));

	article.tags = myftTopics.concat(defaultTopics).slice(0,5);
}

function selectAuthorsForDisplay (article) {
	article.authors = article.metadata.filter(tag => tag.taxonomy === 'authors');
}

function selectTagToFollow (article) {
	if(!article.tagToFollow) {
		return;
	}

	article.tagToFollow = article.metadata
		.find(tag => tag.id === article.tagToFollow);

	addTagTitlePrefix(article.tagToFollow);
}

module.exports = function (article) {
	fillProperties(article);
	selectPrimaryTheme(article);
	selectPrimarySection(article);
	selectPrimaryBrand(article);
	selectPrimaryTag(article);
	selectTagsForDisplay(article);
	selectTagToFollow(article);
	selectAuthorsForDisplay(article);
	return article;
};
