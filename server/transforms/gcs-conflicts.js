// Hide elements that conflict with the GCS
module.exports = $ => {
	const gcsHideClass = 'p402_hide';
	['n-content-related-box', 'n-content-video', 'n-content-image']
		.forEach(className => $(`.${className}`).addClass(gcsHideClass));

	return $
};
