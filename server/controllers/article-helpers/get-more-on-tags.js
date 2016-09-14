const addTagTitlePrefix = require('./tag-title-prefix');

module.exports = function (primaryTheme, primarySection, primaryBrand) {
	const moreOnTags = [];

	primaryTheme && moreOnTags.push(primaryTheme);
	primarySection && moreOnTags.push(primarySection);
	primaryBrand && moreOnTags.push(primaryBrand);

	if (!moreOnTags.length) {
		return;
	}

	return moreOnTags.slice(0, 2).map(tag => addTagTitlePrefix(tag));

};
