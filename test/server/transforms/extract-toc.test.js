require('chai').should();
const extractToc = require('../../../server/transforms/extract-toc');

describe('Extracting Table of Contents from Body', () => {

	it('should extract the table of contents from the body', () => {
		const bodyHTML = (
			'<body>' +
				'<div class="table-of-contents" data-trackable="table-of-contents">' +
					'<h2 class="table-of-contents__title">In this article</h2>' +
					'<ol class="table-of-contents__chapters ng-list-reset">' +
						'<li class="table-of-contents__chapter"><a class="table-of-contents__link" href="#crosshead-1" data-trackable="toc">Economics</a></li>' +
						'<li class="table-of-contents__chapter"><a class="table-of-contents__link" href="#crosshead-2" data-trackable="toc">Business</a></li>' +
						'<li class="table-of-contents__chapter"><a class="table-of-contents__link" href="#crosshead-3" data-trackable="toc">Politics</a></li>' +
					'</ol>' +
				'</div>' +
				'<p>test test test</p>' +
			'</body>'
		);
		const resultObject = extractToc(bodyHTML);
		resultObject.tocHTML.should.equal(
			'<div class="table-of-contents" data-trackable="table-of-contents">' +
				'<h2 class="table-of-contents__title">In this article</h2>' +
				'<ol class="table-of-contents__chapters ng-list-reset">' +
					'<li class="table-of-contents__chapter"><a class="table-of-contents__link" href="#crosshead-1" data-trackable="toc">Economics</a></li>' +
					'<li class="table-of-contents__chapter"><a class="table-of-contents__link" href="#crosshead-2" data-trackable="toc">Business</a></li>' +
					'<li class="table-of-contents__chapter"><a class="table-of-contents__link" href="#crosshead-3" data-trackable="toc">Politics</a></li>' +
				'</ol>' +
			'</div>'
		);
		resultObject.bodyHTML.should.equal(
			'<body>' +
				'<p>test test test</p>' +
			'</body>'
		);
	});

	it('should body untouched if no table of contents', () => {
		const bodyHTML = (
			'<body>' +
				'<p>test test test</p>' +
				'<p>test test test</p>' +
			'</body>'
		);
		const resultObject = extractToc(bodyHTML);
		resultObject.bodyHTML.should.equal(
			'<body>' +
				'<p>test test test</p>' +
				'<p>test test test</p>' +
			'</body>'
		);
	});

});
