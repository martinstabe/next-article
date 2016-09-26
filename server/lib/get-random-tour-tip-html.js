const cheerio = require('cheerio');
const ReactServer = require('react-dom/server');
const React = require('react');
const TourTip = require('@financial-times/n-ui/tour-tip/component');
const getRandomTourTip = require('@financial-times/n-ui/tour-tip/get-tip-model').getRandomOfSize;

module.exports = () => {
	const tourTipHtml = ReactServer.renderToStaticMarkup(<TourTip {...{data: getRandomTourTip('s')}} />);
	const $tourTip = cheerio.load(tourTipHtml, { decodeEntities: false });
	$tourTip('.tour-tip').addClass('tour-tip--article-page');
	return $tourTip.html();
};
