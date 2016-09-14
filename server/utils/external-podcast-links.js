const podcastMapping = require('n-podcast-mapping');

function source (url) {
	if (url.includes('apple.com')) {
		return 'itunes';
	}
	if (url.includes('stitcher.com')) {
		return 'stitcher';
	}
	if (url.includes('audioboom.com')) {
		return 'audioboom';
	}
	if (url.includes('soundcloud.com')) {
		return 'soundcloud';
	}
	if (url.includes('overcast.fm')) {
		return 'overcast';
	}
	if (url.includes('rss.acast.com')) {
		return 'rss';
	}
}

module.exports = function externalPodcastLinks (showUrl) {
	const showSlug = showUrl.replace('http://rss.acast.com/', '');
	const links = podcastMapping.linksFor(showSlug).concat(showUrl);

	return links.reduce(function (map, value) {
		const key = source(value);
		key && (map[key] = value);
		return map;
	}, {});
};
