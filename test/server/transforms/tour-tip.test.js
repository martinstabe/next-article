const proxyquire = require('proxyquire');
const cheerio = require('cheerio');
const expect = require('chai').expect;

const mockTourTipHtml = '<div class="tour-tip"></div>';
const tourTipTransform = proxyquire('../../../server/transforms/tour-tip', {'../lib/get-random-tour-tip-html': () => mockTourTipHtml});

describe('Tour tip component inside body', function () {

	describe('Position component', function () {
		const flags = {nextFtTour: true, nextFtTourTipArticlePage: true};

		it('should insert the component after the first paragraph', () => {
			const $ = cheerio.load('<p>1</p><p>2</p><p>3</p><p>4</p><p>5</p><p>6</p>');
			tourTipTransform($, flags);
			expect($.html()).to.equal(`<p>1</p>${mockTourTipHtml}<p>2</p><p>3</p><p>4</p><p>5</p><p>6</p>`);
		});


		it('should not insert the component if there is only one paragraph', () => {
			const $ = cheerio.load('<p>1</p><img>');
			tourTipTransform($, flags);
			expect($.html()).to.equal('<p>1</p><img>');
		});

		it('should not insert the component if there are fewer than 2 paras after the proposed place', () => {
			// this fixes problems where there isn't enough text between the tip and e.g. an add and we get loads of
			// whitespace
			const $ = cheerio.load('<p>1</p><p>2</p>');
			tourTipTransform($, flags);
			expect($.html()).to.equal('<p>1</p><p>2</p>');
		});

		it('should not insert the component if follow two paras are followed by a quote', () => {
			// this fixes case where there are two paras between the tip and a quote but on of the paras is like an intro
			// to the quote so its really small and we end up with loads of whitespace
			const $ = cheerio.load('<p>1</p><p>2</p><p>3</p><blockquote>do or do not there is no try</blockquote><p>4</p><p>5</p>');
			tourTipTransform($, flags);
			expect($.html()).to.equal('<p>1</p><p>2</p><p>3</p><blockquote>do or do not there is no try</blockquote><p>4</p><p>5</p>');
		});

		it('should not insert the component if follow two paras are followed by a quote', () => {
			// this fixes case where there are two paras between the tip and a quote but on of the paras is like an intro
			// to the quote so its really small and we end up with loads of whitespace
			const $ = cheerio.load('<p>1</p><p>2</p><p>3</p><blockquote>do or do not there is no try</blockquote><p>4</p><p>5</p>');
			tourTipTransform($, flags);
			expect($.html()).to.equal('<p>1</p><p>2</p><p>3</p><blockquote>do or do not there is no try</blockquote><p>4</p><p>5</p>');
		});

		describe('Light sign up', function () {
			const lightSignupHtml = '<div class="p402_hide" data-o-email-only-signup-position-mvt=""></div>';

			it('should leave space for light signup when user is anonymous', () => {
				const $ = cheerio.load(`<p>1</p>${lightSignupHtml}<p>2</p><p>3</p><p>4</p><p>5</p>`);
				tourTipTransform($, flags, {
					userIsAnonymous: true
				});
				expect($.html()).to.equal(`<p>1</p>${lightSignupHtml}<p>2</p>${mockTourTipHtml}<p>3</p><p>4</p><p>5</p>`);
			});

			it('should occupy the same space as light sign up (which won\'t materialise) when use is not anonymous', () => {
				const $ = cheerio.load(`<p>1</p>${lightSignupHtml}<p>2</p><p>3</p><p>4</p><p>5</p>`);
				tourTipTransform($, flags);
				expect($.html()).to.equal(`<p>1</p>${mockTourTipHtml}${lightSignupHtml}<p>2</p><p>3</p><p>4</p><p>5</p>`);
			});
		});

	});

	describe('Flags not on', function () {

		it('should not insert anything if nextFtTour flag is false', () => {
			const $ = cheerio.load('<p>1</p><p>2</p><p>3</p><p>4</p><p>5</p><p>6</p>');
			tourTipTransform($, {nextFtTour: false});
			expect($.html()).to.equal('<p>1</p><p>2</p><p>3</p><p>4</p><p>5</p><p>6</p>');
		});

		it('should not insert anything if nextFtTour flag is true but nextFtTourTipArticlePage is false', () => {
			const $ = cheerio.load('<p>1</p><p>2</p><p>3</p><p>4</p><p>5</p><p>6</p>');
			tourTipTransform($, {nextFtTour: true, nextFtTourTipArticlePage: false});
			expect($.html()).to.equal('<p>1</p><p>2</p><p>3</p><p>4</p><p>5</p><p>6</p>');
		});

		it('should not insert anything if nextFtTourTipArticlePage flag is true but nextFtTour is false', () => {
			const $ = cheerio.load('<p>1</p><p>2</p><p>3</p><p>4</p><p>5</p><p>6</p>');
			tourTipTransform($, {nextFtTour: false, nextFtTourTipArticlePage: true});
			expect($.html()).to.equal('<p>1</p><p>2</p><p>3</p><p>4</p><p>5</p><p>6</p>');
		});

	});

	describe('Fragment view', () => {
		const flags = {nextFtTour: true};
		const options = {fragment: true};

		it('should not insert anything on a fragment view', () => {
			const $ = cheerio.load('<p>1</p><p>2</p><p>3</p><p>4</p><p>5</p>');
			tourTipTransform($, flags, options);
			expect($.html()).to.equal('<p>1</p><p>2</p><p>3</p><p>4</p><p>5</p>');
		});
	});

});
