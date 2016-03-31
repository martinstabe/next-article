"use strict";

var cheerio = require('cheerio');

module.exports = function ($) {
	const pars = $('p');
	pars.each((index, par) => {
		if(index > 1 && par.next && par.next.name === 'p') {
			$(par).after('<div class="o-ads in-article-advert" data-o-ads-name="mpu-in-article" data-o-ads-targeting="pos=mpu;" aria-hidden="true"></div>');
			return false;
		}
	});

	return $;
};
