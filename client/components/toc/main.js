module.exports.init = function (flags) {
	if (!flags.get('articleTOC')) {
		return false;
	}

	const duration = 1000;
	// https://gist.github.com/gre/1650294
	const easeFunction = function (t) { return 1-(--t)*t*t*t };

	const tocs = document.querySelectorAll('.table-of-contents');
	if (tocs.length) {
		[].slice.call(tocs).forEach(function (toc) {
			toc.addEventListener('click', function (event) {
				event.preventDefault();
				event.stopPropagation();

				const scrollFrom = document.body.scrollTop;
				const scrollDist = document.querySelector(event.target.getAttribute('href')).getBoundingClientRect().top;
				const startTime = new Date();
				const interval = window.setInterval(function () {
						const elapsed = new Date() - startTime;
						document.body.scrollTop = scrollFrom + (easeFunction(elapsed / duration) * scrollDist);
					}, 15);

				window.setTimeout(function () {
						window.clearInterval(interval);
						window.location.hash = event.target.getAttribute('href');
					}, duration);
			});
		});
	}
};
