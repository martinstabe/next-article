'use strict';

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

function lazyLoad (opts) {

	return new Promise((resolve, reject) => {
		const target = document.querySelector(opts.targetEl);
		if (target) {
			const commentsFragmentIndicator = window.location.hash.indexOf('#lf-content') > -1;
			if (opts.commentsLazyLoad && window.IntersectionObserver && !commentsFragmentIndicator) {
				const observer = new IntersectionObserver(
					function (changes) {
						intersectionCallback(this, changes, opts.sources, resolve);
						window.FT.commentsRumLazyStart = Date.now();
					},
					{ rootMargin: `${opts.threshold}px` }
				);
				observer.observe(target);
			} else {
				loadSources(opts.sources, resolve);
			}
		} else {
			reject('targetEl does not exist');
		}
	});
}

module.exports = {
	init: () => {

		window.FT = window.FT || {};
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
		});

		tracking.init();
	}
};
