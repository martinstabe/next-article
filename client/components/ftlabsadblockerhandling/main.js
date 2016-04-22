const approaches = [require('./no-vowels'), require('./bart'), require('./ad-revenue'), require('./lets-talk'), require('./ad-blocking-articles')];

const storage = {
	get : function () {
		return localStorage.getItem('ftlabsAdBlockerHandling');
	},
	set : function (val) {
		localStorage.setItem('ftlabsAdBlockerHandling', val);
	}
};

let storedValue = storage.get();
const UI = document.querySelector('.ftlabs-ad-block-handling-ui');

function previousApproach(){

	if(storedValue > 0){
		storage.set(parseInt(storedValue) - 1);
	} else {
		storage.set(approaches.length - 1);
	}

	document.location.reload();

}

function nextApproach(){

	if(storedValue < approaches.length - 1){
		storage.set(parseInt(storedValue) + 1);
	} else {
		storage.set(0);
	}

	document.location.reload();

}

function bindUIEventListeners(){

	const controls = document.querySelectorAll('.ftlabs-ad-block-handling-ui .controls button');

	controls[0].addEventListener('click', previousApproach, false);
	controls[1].addEventListener('click', nextApproach, false);

}

function initialise (){

	if(storedValue === null){
		const newValue = Math.random() * approaches.length | 0;
		storage.set( newValue );
		storedValue = newValue
	}

	if(storedValue > approaches.length - 1){
		storedValue = approaches.length - 1;
	}

	const selectedApproach = approaches[parseInt(storedValue)];

	selectedApproach.run();
	UI.querySelector('h3').textContent = selectedApproach.description;

	bindUIEventListeners();

}

module.exports = {
	init : initialise
}
