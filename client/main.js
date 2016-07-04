'use strict';

const oViewport = require('n-ui/viewport');
const nVideo = require('n-video');
const lightSignup = require('o-email-only-signup');
const nUiConfig = require('./n-ui-config');
import {bootstrap} from 'n-ui';

bootstrap(nUiConfig, ({flags, mainCss}) => {

	const slideshow = require('./components/slideshow/main');
	const readingHistory = require('./components/reading-history');
	const scrollDepth = require('./components/article/scroll-depth');

	const commentsIcon = require('./components/comments/icon');
	const commentsSkeleton = require('./components/comments/skeleton');
	const lazyLoad = require('./components/comments/lazy-load');

	const onwardJourney = require('./components/onward-journey/main');
	const toc = require('./components/toc/main');
	const share = require('./components/share/main');
	const trackEvent = require('./components/utils/tracking');

	oViewport.listenTo('resize');

	if (document.querySelector('*[data-article-status="error"]')) {
		return;
	}

	const uuid = document.querySelector('article[data-content-id]').getAttribute('data-content-id');

	if (uuid) {
		readingHistory.add(uuid);
	}

	if (flags.get('articleShareButtons')) {
		share.init();
	}

	toc.init(flags);
	scrollDepth.init(flags);

	mainCss.then(() => {
		slideshow(document.querySelectorAll('.article ft-slideshow'));
		onwardJourney.init(flags);
		lightSignup.init();
		nVideo.init({
			// For generating placeholder image
			optimumWidth: 680,
			placeholder: true,
			placeholderTitle: true
		});

		if(flags.get('articleComments') && document.querySelector('#comments')) {

			const commentsEl = document.getElementById('comments');
			const commentsJsLocation = commentsEl.getAttribute('data-comments-js');
			const commentsCssLocation = commentsEl.getAttribute('data-comments-css');
			const commentsLazyLoad = commentsEl.getAttribute('data-comments-lazy-load') === 'true';

			commentsIcon.init();
			commentsSkeleton.init();

			lazyLoad({
				targetEl: '#comments',
				sources: [commentsJsLocation, commentsCssLocation],
				threshold: 600,
				commentsLazyLoad
			}).then(function() {
				var data = {
					action: 'view',
					category: 'comments',
					context: {
						product: 'next',
						source: 'next-article'
					}
				};
				trackEvent(data);
			});

		}
	});


});
