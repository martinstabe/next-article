'use strict';

module.exports = function($) {

	const $links = $('a');
	const httpMatcher = /^http/;
	const ftMatcher = /\.ft\.com\//;

	$links.each(i => {
		const $thisLink = $links.eq(i);

		if (httpMatcher.test($thisLink.attr('href')) &&
				!ftMatcher.test($thisLink.attr('href'))) {
			$thisLink.attr('target', '_blank');
		}
	});

	return $;

}
