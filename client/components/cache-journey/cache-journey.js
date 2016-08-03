import * as serviceWorker from 'n-service-worker';

const nonNull = item => item !== null;

export default () => {
	// grab the articles most likely to make the onward journey
	const onwardArticles = []
		.concat(
			document.querySelector('.next-up__headline'),
			[...document.querySelectorAll('.n-content-related-box__headline-link')]
		)
		.filter(nonNull);
	serviceWorker
		.message({
			type: 'cacheContent',
			content: onwardArticles.map(linkEl => ({ url: linkEl.getAttribute('href') }))
		})
		.catch(() => { });
}
