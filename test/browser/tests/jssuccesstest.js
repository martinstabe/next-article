/*eslint no-console: 0*/

module.exports = {
	'js-success test': browser => {
		const gtgUrl = browser.globals.gtgUrl(process.env.TEST_APP);
		const testUrl = browser.globals.buildUrl(process.env.TEST_APP, '/content/fb368c7a-c804-11e4-8210-00144feab7de');
		console.log(`Launching ${testUrl}`);
		browser
			.url(gtgUrl)
			// need to set the cookie with JS for IE
			.execute(() => {
				document.cookie = 'next-flags=ads:off; secure=true';
			})
			.url(testUrl)
			.waitForElementPresent('html.enhanced.js-success', 60000);
	},
};
