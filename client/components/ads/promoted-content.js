import React from 'react';
import ReactDOM from 'react-dom';
import oDate from 'o-date';
import crossDomainFetch from 'o-fetch-jsonp';

import * as components from '@financial-times/n-section';

function correlator(len) {
	len = len || 16;
	function genRand(sig) {
		return parseInt(Math.random() * Math.pow(10, sig), 10);
	}

	return (new Date().getTime() + genRand(6)).toString().substr(0, len);
}


const getAdJson = (data) => {

	const jsonResponse = typeof data === 'object' ? data : new Function('return ' + data)();
	const keys = jsonResponse ? Object.keys(jsonResponse) : [];
	const adUnitKey = keys.length ? keys[0] : null
	if(!adUnitKey && jsonResponse && jsonResponse[adUnitKey] && jsonResponse[adUnitKey]['_html_']) {
		return null;
	};
	const markup = jsonResponse[adUnitKey]['_html_'];
	const delimiter = '----------';
	if(markup && markup.length && markup.indexOf(delimiter) >= 0) {

		try {
			const adCustomJson = JSON.parse(markup.split(delimiter)[1]);
			adCustomJson.id = jsonResponse[adUnitKey]['_creative_ids_'][0];
			adCustomJson.lineItemId = jsonResponse[adUnitKey]['_adgroup2_ids_'][0];
			return adCustomJson;
		} catch(e) {
			return null;
		}
	} else {
		return null;
	}
}

const handleResponse = (el, response, flags, ads) => {

	if(!(el && response && response.title)) {
		return;
	}

	const props = {
		data: {
			content: [ response ]
		},
		itemIndex: 0,
		image: {
			position: {
				default: 'embedded'
			},
			widths: [166, 281],
			sizes: {
				default: '166px',
				M: '281px'
			}
		},
		size: 'small',
		standfirst: { show: { default: true } }
	};

	ReactDOM.render(<components.Content {...props} />, el);
	oDate.init(el);
};

function initPaidPost(el, flags, ads) {
	const slotParams = `pos=native`;
	const adTargeting = ads.targeting.get();
	const custParams = Object.keys(adTargeting).map(k => k + '=' + encodeURIComponent(adTargeting[k])).join('&');
	const adUnit = window.oAds.config('gpt').unitName || '5887/ft.com/home/UK';
	const url = `https://securepubads.g.doubleclick.net/gampad/ads?gdfp_req=1&correlator=${correlator()}&output=json_html&impl=fif&sc=1&sfv=1-0-4&iu=%2F5887%2F${adUnit.replace(/\/?5887\//, '')}&sz=320x50&fluid=height&scp=${encodeURIComponent(slotParams)}&ga_sid=1469788770&cust_params=${encodeURIComponent(custParams)}`;

	return crossDomainFetch(url, {
		timeout: 4000,
		mode: 'cors'
	})
	.then(response => {
		if(response.ok) {
			return response.text ? response.text() : response.json();
		}
	})
	.then(getAdJson)
	.then(data => {
		if(data && data.type && data.title) {
			handleResponse(el, data, flags);

			document.querySelector('.promoted-content').classList.add('promoted-content--loaded');

			if(data.type === 'special-report') {
				const secondEl = document.querySelector('.promoted-content__second');
				el.setAttribute('data-o-grid-colspan', '12 M6');
				secondEl.setAttribute('data-o-grid-colspan', '12 M6');
				initPaidPost(secondEl, flags, ads);
			}
		}
	});
};

export default (flags) => {
	if(flags.get('nativeAds') && flags.get('nativeAdsArticle')) {

		const el = document.querySelector('.promoted-content__first');

		if(window.oAds && window.oAds.config('dfp_targeting')) {
			initPaidPost(el, flags, window.oAds);
		} else {
			document.addEventListener('oAds.initialised', e => {
				initPaidPost(el, flags, e.detail);
			});
		}


	}

}
