import * as serviceWorker from 'n-service-worker';

export default () => {
	// grab the articles most likely to make the onward journey
	const onwardArticles = [...document.querySelectorAll('.next-up__header .next-up__headline')];
	serviceWorker
		.message({
			type: 'cacheContent',
			content: onwardArticles.map(linkEl => ({
				url: linkEl.getAttribute('href')
			}))
		})
		.catch(() => { });
}
