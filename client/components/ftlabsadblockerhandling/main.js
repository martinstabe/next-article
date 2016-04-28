const approaches = [require('./no-vowels'), require('./bart')];

const storage = {
	get : function () {
		return localStorage.getItem('ftlabsAdBlockerHandling');
	},
	set : function (val) {
		localStorage.setItem('ftlabsAdBlockerHandling', val);
	}
};

let storedValue = parseInt( storage.get() );

function previousApproach(){
	
	console.log("Previous...");
	
	if(storedValue > 0){
		storage.set(storedValue - 1);
	} else {
		storage.set(approaches.length - 1);
	}
	
	document.location.reload();
	
}

function nextApproach(){

	console.log("Next...");
	
	if(storedValue < approaches.length - 1){
		storage.set(storedValue + 1);
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
	
	console.log('ftlabsAdBlockerHandling initialised');
	
	if(!storedValue){
		const newValue = Math.random() * approaches.length | 0;
		storage.set( newValue );
		storedValue = newValue
	}

	approaches[storedValue]();

	bindUIEventListeners();

}

module.exports = {
	init : initialise
}