module.exports = function ($, flags) {
	if (!flags.lightSignUp) return $;

	const pars = $('p');
	pars.each((index, par) => {
		if(index > 3 && par.next && par.next.name === 'p') {
			$(par).after('<div class="n-light-signup__container"></div>');
			return false;
		}
	});

	return $;
};
