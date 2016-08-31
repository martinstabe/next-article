'use strict';

const oViewport = require('n-ui/viewport');
const OVideo = require('o-video');
const lightSignup = require('o-email-only-signup');
const expander = require('n-ui/expander');
const nUiConfig = require('./n-ui-config');
import {bootstrap} from 'n-ui';
// import cacheJourney from './components/cache-journey/cache-journey';
import {init as commentsInit} from './components/comments';

bootstrap(nUiConfig, ({flags, mainCss}) => {

	const slideshow = require('./components/slideshow/main');
	const readingHistory = require('./components/reading-history');
	const scrollDepth = require('./components/article/scroll-depth');


	const onwardJourney = require('./components/onward-journey/main');
	const toc = require('./components/toc/main');
	const share = require('./components/share/main');


	// cacheJourney();

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
				source: 'brightcove',
				placeholdertitle: true
			});
		});

		if (flags.get('articleComments') && document.querySelector('#comments')) {
			commentsInit();
		}
	});

});
