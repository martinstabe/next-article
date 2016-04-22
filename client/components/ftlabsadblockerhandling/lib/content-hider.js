let contentElement = undefined
let originalContent = undefined;
let parentEl = undefined;

function setElement (element){

	if(contentElement !== undefined || originalContent !== undefined || parentEl !== undefined){
		return false;
	}

	contentElement = element;
	parentEl = element.parentNode;
	originalContent = element.cloneNode(true);

}

function hideContent (){
	contentElement.innerHTML = "";
}

function showContent (){
	parentEl.removeChild(contentElement);
	parentEl.appendChild(originalContent);
}

module.exports = function (){
	return {
		set : setElement,
		hide : hideContent,
		show : showContent
	};
}
