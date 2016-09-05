'use strict';

import oGrid from 'n-ui/grid';
import tracking from './tracking';

const commentsIcon = require('./icon');
const commentsSkeleton = require('./skeleton');

const loadSources = (sources, resolve) => {
	sources.forEach(source => {
		const fileType = source.split('.').pop();
		let element;
		if (fileType === 'js') {
			element = document.createElement('script');
			element.src = source;
		} else {
			element = document.createElement('link');
			element.setAttribute('rel', 'stylesheet');
			element.href = source;
		}
		document.head.appendChild(element);
	});

	resolve();
};

const intersectionCallback = (observer, changes, sources, resolve) => {
	changes.forEach(change => {
		loadSources(sources, resolve);
		observer.unobserve(change.target);
	});
};

function loadComments (commentsEl, opts) {

	return new Promise((resolve, reject) => {
		const sources = [commentsEl.getAttribute('data-comments-js'), commentsEl.getAttribute('data-comments-css')];

		if (!opts.lazy) {
			window.FT.commentsRumLoadStart = Date.now();
			loadSources(sources, resolve);
		}

		const intersectionTarget = document.querySelector(opts.targetSelector);

		if (intersectionTarget) {

			if (window.IntersectionObserver) {
				const observer = new IntersectionObserver(
					function (changes) {
						intersectionCallback(this, changes, sources, resolve);
						window.FT.commentsRumLoadStart = Date.now();
					},
					{ rootMargin: `${opts.threshold}px` }
				);
				observer.observe(intersectionTarget);
			} else {
				window.FT.commentsRumLoadStart = Date.now();
				loadSources(sources, resolve);
			}
		} else {
			reject('no element found to attach intersection observer to');
		}

	});
}

module.exports = {
	init: () => {

		window.FT = window.FT || {};

		const commentsEl = document.getElementById('comments');

		commentsIcon.init();
		commentsSkeleton.init();

		let loadOpts = {lazy: false};
		// before turning on lazy loading check first that lazy loading is enabled
		// and the user has not followed a link to the comments section
		if (commentsEl.getAttribute('data-comments-lazy-load') === 'true' && !/#lf-content|#comments|#lf-comments/.test(window.location.hash)) {
			const initialEngagement = tracking.getInitialEngagement();
			if (['default', 'S'].indexOf(oGrid.getCurrentLayout()) > -1) {
				if (initialEngagement !== 'active') {
					loadOpts = {
						targetSelector: '.n-content-copyright',
						threshold: initialEngagement === 'passive' ? 600 : 0,
						lazy: true
					};
				}
			} else {
				if (initialEngagement !== 'active') {
					loadOpts = {
						targetSelector: '#comments',
						threshold: 600,
						lazy: true
					};
				}
			}
		}

		loadComments(commentsEl, loadOpts);

		tracking.init();
	}
};
