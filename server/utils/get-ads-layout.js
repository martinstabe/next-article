'use strict';

module.exports = (requestedLayout, flags) => {
	//map some url params to existing ad layout names

	if(flags.adsNewProposition && !requestedLayout) {
		requestedLayout = 'responsive';
	}
	const mapping = {
		'responsive': 'hlfpage'
	};
	return mapping[requestedLayout] || requestedLayout || 'default';
}
