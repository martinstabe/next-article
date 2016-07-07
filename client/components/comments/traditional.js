'use strict';
const OComments = require('o-comments');

module.exports = {};
module.exports.init = function(uuid, flags) {
	flags = window.nextFeatureFlags;

	const commentsFlag = flags.filter((obj) => {
		return obj.name === 'articleComments';
	})[0];

	if (!commentsFlag.state) {
		return;
	}

	OComments.on('widget.renderComplete', function () {
		const skeleton = document.querySelector('[data-skeleton=comments]');
		skeleton.parentNode.removeChild(skeleton);
	});

	new OComments(document.querySelector('#comments'), {
		title: document.title,
		url: document.location.href,
		articleId: uuid, // NOTE: to test, use '3a499586-b2e0-11e4-a058-00144feab7de'
		livefyre: {
			initialNumVisible: 10,
			disableIE8Shim: true,
			disableThirdPartyAnalytics: true
		}
	});
};
