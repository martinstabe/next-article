module.exports = function ($, flags, adsLayout) {
	// how and where do I scope this to anon users? don't have access to the locals here?
    if (flags.lightSignUp) {
        const pars = $('p');
	    pars.each((index, par) => {
		    if(index > 3 && par.next && par.next.name === 'p') {
                // TODO: feels wrong. Import the markup from the component?
			    $(par).after(`<div class="n-light-signup" data-trackable="light-signup">

	<div class="o-grid-row o-grid-row--compact">
		<div data-o-grid-colspan="12">
            <div class="n-light-signup__close">close</div>
			<h2 class="n-light-signup__heading">Want a summary of the top stories of the day?</h2>
			<p class="n-light-signup__tagline">
				We are currently trialling and collecting feedback on our daily top stories summary email. Please enter your email address below to be among the first to receive the email that contains 3 free articles, for 7 days.
			</p>
		</div>
	</div>

	<div class="n-light-signup__secondary">

		<p class="n-light-signup__checkbox-group o-forms-group">
            <input type="checkbox" name="terms" id="checkbox" value="terms" class="o-forms-checkbox"/>
			<label class="o-forms-label" for="checkbox">By ticking this checkbox you agree to our <a href="http://help.ft.com/tools-services/ft-com-terms-and-conditions">terms and conditions</a>, <a href="http://help.ft.com/tools-services/how-the-ft-manages-cookies-on-its-websites">cookie policy</a> and <a href="http://help.ft.com/tools-services/financial-times-privacy-policy">privacy policy</a>.</label>
            <div class="o-forms-errortext n-light-signup__consent-error-msg">You must accept the T&Cs to proceed.</div>
		</p>

		<div class="o-grid-row">

            <div class="n-light-signup__email-group o-forms-group">
                <label for="email" class="o-forms-label">Email address:</label>
				<input type="text" id="email" placeholder="your@email.com" name="email" class="n-light-signup__email o-forms-text" data-trackable="email"/>
                <div class="o-forms-errortext n-light-signup__email-error-msg">Invalid email</div>
				<input type="submit" value="Subscribe" class="n-light-signup__submit" data-trackable="submit"/>
            </div>

		</div>

		<div class="o-grid-row o-grid-row--compact">

			<div data-o-grid-colspan="12">
				<p class="n-light-signup__no-spam">
					No spam. One-click unsubscribe. <a href="#" class="n-light-signup__link" data-trackable="see-sample-email">See sample email</a>.
				</p>
			</div>

		</div>

	</div>

	<div class="n-light-signup__thank-you" style="display:none;">
		<p class="n-light-signup__heading">Thank you for signing up!</p>
		<p>We will send you a summary of the top stories later this afternoon.</p>
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
