const approaches = [
	require('./no-vowels'),
	require('./bart'),
	require('./ad-revenue'),
	require('./lets-talk'),
	require('./ad-blocking-articles'),
	require('./delay-content'),
	require('./guidelines'),
	require('./intra-word-shuffle'),
	require('./archive-ocr')
];

const SuperStore = require('superstore');
const store = new SuperStore('local', 'ftlabs');
const trackEvent = require('../utils/tracking');


let storedValue = NaN;
const UI = document.querySelector('.ftlabs-ad-block-handling-ui');

function previousApproach () {

	if (storedValue > 0) {
		store.set('AdBlockerHandling', storedValue - 1);
	} else {
		store.set('AdBlockerHandling', approaches.length - 1);
	}
	document.location.reload();
}

function nextApproach (){

	if (storedValue < approaches.length - 1) {
		store.set('AdBlockerHandling', storedValue + 1);
	} else {
		store.set('AdBlockerHandling', 0);
	}
	document.location.reload();
}

function bindUIEventListeners (){

	const controls = document.querySelectorAll('.ftlabs-ad-block-handling-ui .controls button');

	controls[0].addEventListener('click', previousApproach, false);
	controls[1].addEventListener('click', nextApproach, false);
}

function initialise () {

	store.get('AdBlockerHandling')
		.then(val => {

			val = parseInt(val);

			if ( isNaN(val) ) {
				const newValue = Math.random() * approaches.length | 0;
				store.set('AdBlockerHandling', newValue);
				storedValue = newValue;
			} else {
				storedValue = val;
			}

			if (storedValue > approaches.length - 1) {
				store.set('AdBlockerHandling', approaches.length - 1)
				storedValue = approaches.length - 1;
			}

			const selectedApproach = approaches[storedValue];
			selectedApproach.run();
			UI.querySelector('h3').textContent = `Idea ${storedValue + 1} of ${approaches.length}: ${selectedApproach.name}`;
			UI.querySelector('p').textContent = `${selectedApproach.description}`;

			bindUIEventListeners();

			trackEvent({
				action: 'poisonLoaded',
				category: 'page',
				meta: {
					id: storedValue + 1,
					slug : selectedApproach.name
				},
				context: {
					product: 'next',
					source: 'next-article'
				}
			});

		})
		.catch(err => {
			console.error("An error has occured with ftLabsAdBlockerHandling", err);
		})
	;

}

module.exports = {
	init : initialise
}
