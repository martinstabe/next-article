'use strict';

const throttle = require('../../libs/throttle');

function createElements(source) {
	return new Promise((resolve) => {
		let fileType = source.substr((source.lastIndexOf('.') + 1));
		let element;

		if(fileType === 'js') {
			element = document.createElement('script');
			element.src = source;
		} else {
			element = document.createElement('link');
			element.setAttribute('rel', 'stylesheet');
			element.href = source;
		}

		document.head.appendChild(element);
		resolve();
	});
}

function elementInView(target, threshold) {
	let targetPos = target.getBoundingClientRect().top;
	let loadPos = window.innerHeight + threshold;

	return targetPos <= loadPos ? true : false;
}

function lazyLoad(opts) {
	return new Promise((resolve) => {
		const target = document.querySelector(opts.targetEl);
		if(target) {
			let loaded = false;
			const threshold = opts.threshold || 250;
			const loadContent = () => {
				if(!loaded && elementInView(target, threshold)) {
					const appendElements = opts.sources.map(createElements);
					Promise.all(appendElements).then(function() {
						loaded = true;
						resolve();
					});
				}
			}

			window.addEventListener('scroll', throttle(loadContent, 250));
		}
	});
}

module.exports = lazyLoad;
