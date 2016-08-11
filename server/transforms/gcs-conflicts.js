// Hide elements that conflict with the GCS
module.exports = $ => {
	const gcsHideClass = 'p402_hide';
	['n-content-related-box', 'n-content-video']
		.forEach(className => $(`.${className}`).addClass(gcsHideClass));

	return $
};
