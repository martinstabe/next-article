/* global describe, it */
'use strict';

var transform = require('./transform-helper');
require('chai').should();

describe('Interactoive Graphics', function () {

	it('turns it into an iframe', () => {
		return transform(
				'<body>' +
					'<p>' +
						'<a data-asset-type="interactive-graphic" data-height="370" data-width="600" href="https://www.ft.com/ig/features/women-of-the-year-2015/"></a>' +
					'</p>' +
				'</body>'
			)
			.then(function (transformedXml) {
				transformedXml.should.equal(
					'<p><iframe class="article__interactive" src="https://www.ft.com/ig/features/women-of-the-year-2015/" width="600" height="370" scrolling="no"></iframe></p>\n'
				);
			});
	});

	it('removes it if it does not use https', () => {
		return transform(
			'<body>' +
				'<p>' +
					'<a data-asset-type="interactive-graphic" data-height="370" data-width="600" href="http://www.ft.com/ig/features/women-of-the-year-2015/"></a>' +
				'</p>' +
			'</body>'
			)
			.then(function (transformedXml) {
				transformedXml.should.equal(
					'<p></p>\n'
				);
			});

	});

});
