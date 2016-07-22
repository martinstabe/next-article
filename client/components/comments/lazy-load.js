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
		const RUM = true;
		const target = document.querySelector(opts.targetEl);
		if (target) {
			if (opts.commentsLazyLoad && window.IntersectionObserver) {
				const observer = new IntersectionObserver(
					function (changes) {
						intersectionCallback(this, changes, opts.sources, resolve);
						if (RUM) {
							broadcast('oTracking.event', {
								category: 'comments',
								action: 'lazy-load'
							});
						}
					},
					{ rootMargin: `${opts.threshold}px` }
				);
				observer.observe(target);
				const rumObserver = new IntersectionObserver(
					function () {
						if (RUM) {
							broadcast('oTracking.event', {
								category: 'comments',
								action: 'in-view'
							});
							rumObserver.unobserve(target);
						}
					},
					{ rootMargin: `0px` }
				);
				rumObserver.observe(target);

			} else {
				loadSources(opts.sources, resolve);
			}
		} else {
			reject('targetEl does not exist');
		}
	});
