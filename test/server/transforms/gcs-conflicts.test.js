require('chai').should();
const cheerio = require('cheerio');

const gcsConflicts = require('../../../server/transforms/gcs-conflicts');

describe('GCS Conflicts', () => {

	it('should add GCS hide class to video content', () => {
		const html = `
			<p>test test test</p>
			<div class="n-content-video">
				<p>test test test</p>
			</div>
		`;
		const $ = gcsConflicts(cheerio.load(html));
		$('.n-content-video').hasClass('p402_hide').should.be.true;
		$('.p402_hide').length.should.equal(1);
	});

	it('should add GCS hide class to related content', () => {
		const html = `
			<p>test test test</p>
			<div class="n-content-related-box">
				<p>test test test</p>
			</div>
		`;
		const $ = gcsConflicts(cheerio.load(html));
		$('.n-content-related-box').hasClass('p402_hide').should.be.true;
		$('.p402_hide').length.should.equal(1);
	});

});
