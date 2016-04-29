const Hider = require('./lib/content-hider');
let amountToType = 3;
const replacementMarkup = `
	<div class="i-will-not">
		<h3>We notice you're using an ad-blocker.</h3>
		<p>That's ok, just type 'I will not block ads' <a class="amt">${amountToType}</a>x to view the article...</p>
		<input type="text" />
	</div>
`;
const h = new Hider();

function handleInput (){
	if(this.value.toLowerCase() === "i will not block ads"){
		amountToType -= 1;
		if(amountToType === 0){
			h.show();	
		} else {
			document.querySelector('.i-will-not .amt').textContent = amountToType;
			document.querySelector('.i-will-not input').value = "";
		}
	}
}

module.exports = {
	name : `Chalkboard`,
	description : `Tell us what you won't do...`,
	run : function (){
		
		const contentElement = document.querySelector('.article__body.n-content-body');
		
		h.set(contentElement);
		
		setTimeout(function(){
			
			h.hide();
			contentElement.innerHTML = replacementMarkup;
			
			document.querySelector('.i-will-not input').addEventListener('keyup', handleInput, false);
			
		}, 5000);
		
	}
}