import React from 'react';
import ReactDOM from 'react-dom';
import { EmailArticleData, emailArticleModes, EmailArticleView } from 'n-email-article';

const OShare = require('o-share');
const fetchres = require('fetchres');

function loadShareCount () {
	let shareCountList = document.querySelectorAll('.js-share-count');
	let shareCountArray = Array.prototype.slice.call(shareCountList);
	let article = document.querySelector('.article');
	let articleId = article.getAttribute('data-content-id');
	if(shareCountArray.length) {
		let url = shareCountArray[0].getAttribute('data-shared-url');
		if(url && url.length) {
			fetch(`/article/${articleId}/social-counts?url=${url}`, { credentials: 'same-origin' })
			.then(fetchres.json)
			.then(function (counts) {
				if (counts.shares !==undefined) {
					shareCountArray.forEach(shareCount => shareCount.textContent = `${counts.shares} shares`);
				}
			});
		}
	}
}

exports.init = function () {
	const shareContainer = document.querySelector('[data-o-component=o-share]');
	if (shareContainer && !shareContainer.classList.contains('data-o-share--js')) {
		new OShare(shareContainer);
		loadShareCount();
	}

	const emailArticle = {}; // we will lazily load the email article stuff when they're needed
	[...document.querySelectorAll('[data-n-article-email-clickable]')].forEach(button => {
		button.addEventListener('click', () => {
			// lazily load the data
			if (!emailArticle.data) emailArticle.data = new EmailArticleData();
			const id = button.dataset.nArticleEmailContainer;
			const isFreeArticle = button.dataset.nArticleEmailFreeArticle === true || button.dataset.nArticleEmailFreeArticle === 'true';
			const mode = isFreeArticle ? emailArticleModes.FREE : emailArticleModes.GIFT_OR_SUB;
			const isTop = id === 'top';
			// lazily load the view
			if (!emailArticle[id]) {
				const props = {
					mode: mode,
					isTop: isTop,
					store: emailArticle.data.store,
					actions: emailArticle.data.actions,
					dispatch: emailArticle.data.dispatch
				};
				emailArticle[id] = React.createElement(EmailArticleView, props);
				const container = document.querySelector(`[data-n-article-email-${id}-container]`);
				ReactDOM.render(emailArticle[id], container);
			}
			// toggle showing/hiding of the view
			emailArticle.data.dispatch(emailArticle.data.actions[isTop ? 'toggleOpenTop' : 'toggleOpenBottom']());
		});
	});

};
