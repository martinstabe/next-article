const cheerio = require('cheerio');

module.exports = function (bodyHTML) {

	const $ = cheerio.load(bodyHTML);

	return {
		tocHTML: $.html($('.table-of-contents').remove()),
		bodyHTML: $.html()
	};
};
