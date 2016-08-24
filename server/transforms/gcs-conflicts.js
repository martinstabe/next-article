const cheerio = require('cheerio');

// Hide elements that conflict with the GCS
module.exports = bodyHTML => {
	const $ = cheerio.load(bodyHTML);
	const gcsHideClass = 'p402_hide';
	['n-content-related-box', 'n-content-video', 'n-content-image']
		.forEach(className => $(`.${className}`).addClass(gcsHideClass));

	return {
		bodyHTML: $.html()
	};
};
