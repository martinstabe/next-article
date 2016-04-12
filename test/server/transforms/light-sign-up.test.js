/*global describe, it*/
"use strict";
var cheerio = require('cheerio');
var expect = require('chai').expect;
var lightSignupTransform = require('../../../server/transforms/light-sign-up');

describe('Light Signup component inside body', function () {

	const lightSignupHtml = `<div class="n-light-signup" data-trackable="light-signup">
					<div class="o-grid-row o-grid-row--compact">
						<div data-o-grid-colspan="12">
							<div class="n-light-signup__close"></div>
							<h2 class="n-light-signup__heading">Get a free taste of the FT</h2>
							<p class="n-light-signup__tagline">
								Sample the FT, with the top stories sent FREE to your inbox every morning. For 7 days, you&#x2019;ll get an email with free access to the 3 most read FT stories.
							</p>
						</div>
					</div>
					<div class="n-light-signup__secondary">
						<div class="o-grid-row o-grid-row--compact">
							<div data-o-grid-colspan="12">
								<form class="n-light-signup__form">
									<input type="text" id="email" placeholder="your@email.com" name="email" class="n-light-signup__email o-forms-text" data-trackable="email">
									<div class="o-forms-errortext n-light-signup__email-error-msg n-light-signup__visually-hidden">Invalid email</div>
									<p>By clicking submit you confirm that you have read and agree to the <a href="http://help.ft.com/tools-services/ft-com-terms-and-conditions">terms and conditions</a>, <a href="http://help.ft.com/tools-services/how-the-ft-manages-cookies-on-its-websites">cookie policy</a> and <a href="http://help.ft.com/tools-services/financial-times-privacy-policy">privacy policy</a>.</p>
									<input type="submit" value="Sign up" class="n-light-signup__submit" data-trackable="submit">
									<p class="n-light-signup__no-spam">Unsubscribe at any time. <a href="#" class="n-light-signup__link" data-trackable="see-sample-email">See sample email</a>.</p>
								</form>
							</div>
						</div>
					</div>
				</div>`;

    it('should not do anything if the lightSignUp flag is off', function () {
		var $ = cheerio.load('<p>1</p><p>2</p><p>3</p><p>4</p><p>5</p><p>6</p>');
		$ = lightSignupTransform($, {});
		expect($.html()).to.equal(`<p>1</p><p>2</p><p>3</p><p>4</p><p>5</p><p>6</p>`);
    });

	it('should insert the component between the fifth and sixth paragraphs', function() {
		var $ = cheerio.load('<p>1</p><p>2</p><p>3</p><p>4</p><p>5</p><p>6</p>');
		$ = lightSignupTransform($, {lightSignUp: true});
		expect($.html()).to.equal(`<p>1</p><p>2</p><p>3</p><p>4</p><p>5</p>${lightSignupHtml}<p>6</p>`);
	});

	it('should not insert the component if there are only five paragraphs', function() {
		var $ = cheerio.load('<p>1</p><img><p>2</p><p>3</p><p>4</p><p>5</p>');
		$ = lightSignupTransform($, {lightSignUp: true});
		expect($.html()).to.equal(`<p>1</p><img><p>2</p><p>3</p><p>4</p><p>5</p>`);
	});

	it('should move the component later if there is any other element after the fifth paragraph', function() {
		var $ = cheerio.load('<p>1</p><img><p>2</p><p>3</p><p>4</p><p>5</p><img><p>6</p><p>7</p>');
		$ = lightSignupTransform($, {lightSignUp: true});
		expect($.html()).to.equal(`<p>1</p><img><p>2</p><p>3</p><p>4</p><p>5</p><img><p>6</p>${lightSignupHtml}<p>7</p>`);
	});

});
