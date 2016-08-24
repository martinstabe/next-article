'use strict';

const oViewport = require('n-ui/viewport');
const OVideo = require('o-video');
const lightSignup = require('o-email-only-signup');
const expander = require('n-ui/expander');
const nUiConfig = require('./n-ui-config');
import {bootstrap} from 'n-ui';
import cacheJourney from './components/cache-journey/cache-journey';
import {broadcast} from 'n-ui/utils';

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


	cacheJourney();

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
	scrollDepth(flags);

	mainCss.then(() => {
		slideshow(document.querySelectorAll('.article ft-slideshow'));
		onwardJourney.init(flags);
		lightSignup.init();
		expander.init();

		const videos = document.querySelectorAll('[data-o-component="o-video"]');
		Array.from(videos).forEach(video => {
			new OVideo(video, {
				id: video.getAttribute('data-o-video-id'),
				placeholder: true,
				classes: ['video'],
				advertising: flags.get('videoPlayerAdvertising'),
				source: 'brightcove'
			});
		});

		if(flags.get('articleComments') && document.querySelector('#comments')) {
			window.FT = window.FT || {};
			window.FT.commentsRUM = Math.random() > 0.9 ? Date.now() : false;
			if (window.FT.commentsRUM) {
				broadcast('oTracking.event', {
					action: 'rum-view',
					category: 'comments'
				});
			}
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
			}).then(function () {
				broadcast('oTracking.event', {
					action: 'view',
					category: 'comments',
					context: {
						product: 'next',
						source: 'next-article'
					}
				});
			});

		}
	});


});
