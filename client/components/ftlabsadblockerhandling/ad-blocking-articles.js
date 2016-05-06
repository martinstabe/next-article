'use strict';

var fetchres = require('fetchres');
var oDate = require('o-date');

module.exports = {

	name: 'Ad Blocking Articles',
	description: 'Encourage the reader to read about the topic of ad-blocking.',
	run: () => {

		const articleEl = document.querySelector('.article');
		const articleBody = document.querySelector('.article__body');
		// Select the paras before which links will go
		const articleParas = Array.from(document.querySelectorAll('.article__body p'))
			.filter((p, index) => {
				if (p.parentNode.className.match(/article__body/) &&
						index % 2 === 0 &&
						p.previousSibling.tagName === 'P') {
					return true;
				} else {
					return false;
				}
		});
		const articlesToFetch = articleParas.length;

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
				const childNode = articleParas[index];
				articleBody.insertBefore(adBlockArticleLink, childNode);
			});
			oDate.init();
		})
		.catch(() => {});
	}


};
