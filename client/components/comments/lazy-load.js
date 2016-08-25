import {broadcast} from 'n-ui/utils';
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

export default opts =>
	new Promise((resolve, reject) => {
		const target = document.querySelector(opts.targetEl);
		if (target) {
			const commentsFragmentIndicator = window.location.hash.indexOf('#lf-content') > -1;
			if (opts.commentsLazyLoad && window.IntersectionObserver && !commentsFragmentIndicator) {
				const observer = new IntersectionObserver(
					function (changes) {
						intersectionCallback(this, changes, opts.sources, resolve);
						if (window.FT.commentsRUM) {
							broadcast('oTracking.event', {
								category: 'comments',
								action: 'start-lazy-load',
								context: {
									timing: Date.now() - window.FT.commentsRUMLazyStart
								}
							});
						}
					},
					{ rootMargin: `${opts.threshold}px` }
				);
				observer.observe(target);
				if (window.FT.commentsRUM) {
					window.FT.commentsRUMLazyStart = Date.now();
					const rumObserver = new IntersectionObserver(
						function () {
							broadcast('oTracking.event', {
								category: 'comments',
								action: 'in-view',
								context: {
									timing: Date.now() - window.FT.commentsRUMLazyStart
								}
							});
							rumObserver.unobserve(document.querySelector('.comments__RUM-indicator'));
						},
						{ rootMargin: `0px` }
					);
					rumObserver.observe(document.querySelector('.comments__RUM-indicator'));
				}
			} else {
				loadSources(opts.sources, resolve);
			}
		} else {
			reject('targetEl does not exist');
		}
	});
