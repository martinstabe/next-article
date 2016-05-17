'use strict';
const OComments = require('o-comments');
const trackEvent = require('../utils/tracking');

module.exports = {};
module.exports.init = function(uuid, flags) {
	flags = window.nextFeatureFlags;

	const commentsFlag = flags.filter((obj) => {
		return obj.name === 'articleComments';
	})[0];

	if (!commentsFlag.state) {
		return;
	}

	const eventData = {
		action: 'comment',
		category: 'page',
		context: {
			product: 'next',
			source: 'next-article'
		}
	};


	OComments.on('widget.renderComplete', function () {
		const skeleton = document.querySelector('[data-skeleton=comments]');
		skeleton.parentNode.removeChild(skeleton);
	});
	OComments.on('tracking.postComment', function () {
		eventData.meta = { interaction: 'posted' };
		trackEvent(eventData);
	});
	OComments.on('tracking.likeComment', function (ev) {
		eventData.meta = { interaction: 'liked', id: ev.detail.data.lfEventData.targetId };
		trackEvent(eventData);
	});
	OComments.on('tracking.shareComment', function (ev) {
		eventData.meta = { interaction: 'shared', id: ev.detail.data.lfEventData.targetId };
		trackEvent(eventData);
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
