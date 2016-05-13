'use strict';

module.exports = function ($, flags, options) {
	if (!flags || !flags.lightSignUp || (options && options.fragment)) return $;

	const pars = $('p');
	const variant = flags.lightSignUp;

	if (variant === 'top') positionComponent(1, true);
	if (variant === 'mid') positionComponent(5, true);
	if (variant === 'end') positionComponent(pars.length, false);

	return $;

	function positionComponent (position, checkNextP) {
		pars.each((index, par) => {
			let indexMatches = ((index + 1) >= position);
			let isOrphan = !par.parent;
			let hasNextP = (par.next && par.next.name === 'p');
			if (indexMatches && isOrphan && (hasNextP || !checkNextP)) {
				$(par).after(`<div data-o-email-only-signup-position-mvt="${variant}"></div>`);
				return false;
			}
		});
	}

};
