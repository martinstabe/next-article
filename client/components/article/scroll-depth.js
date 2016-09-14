import {broadcast} from 'n-ui/utils';

const fireBeacon = percentage => {
	const data = {
		action: 'scrolldepth',
		category: 'page',
		meta: {
			percentagesViewed: percentage
		},
		context: {
			product: 'next',
			source: 'next-article'
		}
	};
	broadcast('oTracking.event', data);
};

const intersectionCallback = (observer, changes) => {
	changes.forEach(change => {
		const scrollDepthMarkerEl = change.target;
		fireBeacon(scrollDepthMarkerEl.getAttribute('data-percentage'));
		scrollDepthMarkerEl.parentNode.removeChild(scrollDepthMarkerEl);
		observer.unobserve(scrollDepthMarkerEl);
	});
};

export default (flags, { percentages = [25, 50, 75, 100], articleBodySelector = '.article__body'} = { }) => {
	const articleBody = document.querySelector(articleBodySelector);
	if (flags.get('articleScrollDepthTracking') && articleBody && window.IntersectionObserver) {
		const observer = new IntersectionObserver(
			function (changes) {
				intersectionCallback(this, changes);
			}
		);
		percentages.forEach(percentage => {
			// add a scroll depth marker element
			const targetEl = document.createElement('div');
			targetEl.className = 'article__body__scroll-depth-marker';
			targetEl.style.top = `${percentage}%`;
			targetEl.setAttribute('data-percentage', percentage);
			articleBody.appendChild(targetEl);
			observer.observe(targetEl);
		});
	}
};
