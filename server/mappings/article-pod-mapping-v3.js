'use strict';

const createSrcset = (url, width) =>
	`https://next-geebee.ft.com/image/v1/images/raw/${encodeURIComponent(url)}?source=next&fit=scale-down&compression=best&width=${width} ${width}w`;

const createSize = (sizes, breakpoint) =>
	breakpoint !== 'default' ? `(min-width: ${breakpoint}) ${sizes[breakpoint]}px` : `${sizes[breakpoint]}px`;

module.exports = function articlePodMapping(article) {
	let decoration = {
		url: `/content/${article.id}`,
		subheading: Array.isArray(article.summaries) ? article.summaries[0] : null
	};

	if (article.mainImage && Object.keys(article.mainImage).length > 0) {
		const srcset = [380, 345];
		const sizes = { '76.25em': 380, 'default': 345 };
		const nImageOptions = {
			srcset: srcset
				.map(createSrcset.bind(null, article.mainImage.url))
				.join(', '),
			sizes: Object.keys(sizes)
				.map(createSize.bind(null, sizes))
				.join(', ')
		};
		Object.assign(article.mainImage, nImageOptions, { alt: article.mainImage.description });
	}

	let primarySection = article.metadata.find(tag => tag.primary === 'section');
	let primaryTheme = article.metadata.find(tag => tag.primary === 'theme');

	decoration.primaryTag = primaryTheme || primarySection || null;

	if (primarySection && primarySection.taxonomy === 'specialReports') {
		decoration.primaryTag = primarySection;
	}

	if (decoration.primaryTag) {
		Object.assign(decoration.primaryTag, {
			url: `/stream/${decoration.primaryTag.taxonomy}Id/${decoration.primaryTag.idV1}`
		});
	}

	return Object.assign(article, decoration);
};
