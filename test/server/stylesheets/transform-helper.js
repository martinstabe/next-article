'use strict';

var articleXSLT = require('../../../server/transforms/article-xslt');

module.exports = function(xml) {

	return articleXSLT(xml, 'main');
};
