module.exports = article => {

	article.template =
		'<h3 class="ftlabs-ad-block__title">Read FT articles about ad blocking</h3>' +
		'<article>' +
			'<h4>' +
				`<a class="ftlabs-ad-block__headline" data-trackable="ad-blocking-headline" href="${article.url}">${article.title}</a>` +
			'</h4>' +
			`<time class="ftlabs-ad-block__timestamp o-date" data-o-component="o-date" datetime="${article.publishedDate}" data-o-date-js>${article.publishedDate}</time>` +
		'</article>';

	return article;
};
