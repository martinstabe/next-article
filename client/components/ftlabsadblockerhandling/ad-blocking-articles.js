'use strict';

var fetchres = require('fetchres');
var oDate = require('o-date');

module.exports = {

	name: 'Ad Blocking Articles',
	description: 'What the FT has written related to ad-blocking',
	run: () => {

		const articleEl = document.querySelector('.article');
		const articleBody = document.querySelector('.article__body');
		const articleParas = document.querySelectorAll('.article__body p');
		const articlesToFetch = Math.floor(articleParas.length / 2);

		if (!articleEl) {
			return;
		}

		// use this for deduping also
		const articleId = articleEl.getAttribute('data-content-id');
		// If there is no articleId don't try to load related content
		if (!articleId) {
			return;
		}

		const url = `/article/${articleId}/ad-blocking-articles?count=${articlesToFetch}`;

		fetch(url, { credentials: 'same-origin' })
		.then(fetchres.json)
		.then(resp => {
			if (!resp || resp.articles.length === 0) {
				throw new Error('No response');
			}
			resp.articles.forEach((el, index) => {
				const adBlockArticleLink = document.createElement('aside');
				adBlockArticleLink.setAttribute("class", "ftlabs-ad-block__wrapper");
				adBlockArticleLink.innerHTML = el.template;
				const childNode = articleParas[((index + 1) * 2 )];
				articleBody.insertBefore(adBlockArticleLink, childNode);
			});
			oDate.init();
		})
		.catch(() => {});
	}


};
