module.exports = function ($, flags, adsLayout) {
	if (flags.lightSignUp) {
		const pars = $('p');
		pars.each((index, par) => {
			if(index > 3 && par.next && par.next.name === 'p') {
				$(par).after(`
<div class="n-light-signup" data-trackable="light-signup">

	<div class="o-grid-row o-grid-row--compact">
		<div data-o-grid-colspan="12">
			<div class="n-light-signup__close"></div>
			<h2 class="n-light-signup__heading">Get a free taste of the FT</h2>
			<p class="n-light-signup__tagline">
				Sample the FT, with the top stories sent FREE to your inbox every morning. For 7 days, you’ll get an email with free access to the 3 most read FT stories.
			</p>
		</div>
	</div>

	<div class="n-light-signup__secondary">

		<div class="o-grid-row o-grid-row--compact">
			<div data-o-grid-colspan="12">
				<form class="n-light-signup__form">
					<label for="email" class="o-forms-label n-light-signup__visually-hidden">Email address:</label>
					<input type="text" id="email" placeholder="your@email.com" name="email" class="n-light-signup__email o-forms-text" data-trackable="email"/>
					<div class="o-forms-errortext n-light-signup__email-error-msg n-light-signup__visually-hidden">Invalid email</div>
					<p>By clicking submit you confirm that you have read and agree to the <a href="http://help.ft.com/tools-services/ft-com-terms-and-conditions">terms and conditions</a>, <a href="http://help.ft.com/tools-services/how-the-ft-manages-cookies-on-its-websites">cookie policy</a> and <a href="http://help.ft.com/tools-services/financial-times-privacy-policy">privacy policy</a>.</p>
					<input type="submit" value="Sign up" class="n-light-signup__submit" data-trackable="submit"/>
					<p class="n-light-signup__no-spam">Unsubscribe at any time. <a href="#" class="n-light-signup__link" data-trackable="see-sample-email">See sample email</a>.</p>
				</form>
			</div>
		</div>

	</div>

</div>
`);
				return false; // what does this do?
			}
		});

		return $;
	}
	return $;
};
