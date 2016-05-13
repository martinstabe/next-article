'use strict';

const oViewport = require('n-ui/viewport');
const nVideo = require('n-video');
const lightSignup = require('o-email-only-signup');

require('n-ui').bootstrap(({flags}) => {
	const ftlabsAdBlockerHandling = require('./components/ftlabsadblockerhandling/main');

	if(flags.get('ftlabsAdBlockerHandling')){
		ftlabsAdBlockerHandling.init();
	}

	const slideshow = require('./components/slideshow/main');
	const readingHistory = require('./components/reading-history');
	const scrollDepth = require('./components/article/scroll-depth');

	const commentsIcon = require('./components/comments/icon');
	const commentsSkeleton = require('./components/comments/skeleton');
	const lazyLoad = require('./components/comments/lazy-load');
	const comments = require('./components/comments/main');

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

	slideshow(document.querySelectorAll('.article ft-slideshow'));

	onwardJourney.init(flags);

	if (flags.get('articleShareButtons')) {
		share.init();
	}

	if (flags.get('lightSignUp')) {
		lightSignup.init();
	}

	nVideo.init({
		// For generating placeholder image
		optimumWidth: 680,
		placeholder: true,
		placeholderTitle: true
	});

	toc.init(flags);
	scrollDepth.init(flags);

	if(flags.get('articleComments') && document.querySelector('#comments')) {
		if(flags.get('articleLazyComments')) {
			const commentsEl = document.getElementById('comments');
			const commentsJsLocation = commentsEl.getAttribute('data-comments-js');
			const commentsCssLocation = commentsEl.getAttribute('data-comments-css');

			commentsIcon.init();
			commentsSkeleton.init();

			lazyLoad({
				targetEl: '#comments',
				sources: [commentsJsLocation, commentsCssLocation]
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
		} else {
			comments.init(uuid, flags);
		}
	}
});
