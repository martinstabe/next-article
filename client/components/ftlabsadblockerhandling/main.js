const approaches = [require('./no-vowels')];

const storage = {
	get : function () {
		return localStorage.getItem('ftlabsAdBlockerHandling');
	},
	set : function (val) {
		localStorage.setItem('ftlabsAdBlockerHandling', val);
	}
};

function initialise (){
	
	let storedValue = storage.get();
	
	if(!storedValue){
		const newValue = Math.random() * approaches.length | 0;
		storage.set( newValue );
		storedValue = newValue
	}
	
	approaches[storedValue]();
	
}

module.exports = {
	init : initialise
}