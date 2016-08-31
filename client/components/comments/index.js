'use strict';

import {broadcast} from 'n-ui/utils';
import superstore from 'superstore-sync';

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
	const rumIndicatorEl = document.querySelector('.comments__rum-indicator');
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
				const rumObserver = new IntersectionObserver(
					() => {
						window.FT.commentsRumInView = Date.now();
						startingCommentEngagement
							.then(score => {
								broadcast('oTracking.event', {
									action: 'view',
									category: 'comments',
									context: {
										product: 'next',
										source: 'next-article',
										uiIsDelayed: !window.FT.commentsRumLoaded,
										userCommentEngagement: score
									}
								});
							})
						logCommentEngagement('passive')
						rumObserver.unobserve(rumIndicatorEl);
					},
					{ rootMargin: `0px` }
				);
				rumObserver.observe(rumIndicatorEl);
			} else {
				loadSources(opts.sources, resolve);
			}
		} else {
			reject('targetEl does not exist');
		}
	});
}

const engagementKey = 'next.comments.engagement';

function isWithinNDays (timestamp, n) {
	return (Date.now() - timestamp) < (1000 * 60 * 60 * 24 * n)
}

function getCommentEngagement () {
	const value = superstore.get(engagementKey)
	if (!value) {
		return 'none';
	}

	value = JSON.parse(value);

	// if has actively sought aout/interacted with comments in the last 30 days
	if (value.active && isWithinNDays(value.active, 30)) {
		return 'active';
	}

	if (value.passive) {
		// if scrolled as far as comments once in the last 5 days or 4 times in the last month
		if (isWithinNDays(value.passive[0], 5) ||	value.passive.filter(timestamp => isWithinNDays(timestamp, 30)).length > 3) {
			return 'passive';
		}
	}

	return 'previous';
}

function logCommentEngagement (type) {
	let value = superstore.get(engagementKey)
	value = value ? JSON.parse(value) : {active: null, passive: []};
	if (type === 'active') {
		value.active = Date.now();
	} else {
		value.passive.unshift(Date.now())
		if (value.passive.length > 10) {
			value.passive.pop();
		}
	}
	superstore.set(engagementKey, JSON.stringify(value.slice(0, 5)))
}

let startingCommentEngagement;

module.exports = {
	init: () => {
		startingCommentEngagement = getCommentEngagement();

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

		document.body.addEventListener('oComments.widget.renderComplete', () => {
			window.FT.commentsRumLoaded = Date.now();
			// TODO - record number of comments fetched
			broadcast('oTracking.event', {
				category: 'comments',
				action: 'ready',
				context: {
					timeToLoad: window.FT.commentsRumLoaded - window.FT.commentsRumLazyStart,
					userIsViewing: !!window.FT.commentsRumInView,
					timeUserWaitedToView: window.FT.commentsRumInView ? window.FT.commentsRumLoaded - window.FT.commentsRumInView : 0
				}
			});
		})

		Array.from(document.querySelectorAll('[href="#comments"]')).forEach(el => {
			el.addEventListener('click', () => logCommentEngagement('active'));
		})

		document.body.addEventListener('oComments.tracking.postComment', () logCommentEngagement('active'));

		document.body.addEventListener('oComments.tracking.likeComment', () logCommentEngagement('active'));

		document.body.addEventListener('oComments.tracking.shareComment', () logCommentEngagement('active'));

	}
};
