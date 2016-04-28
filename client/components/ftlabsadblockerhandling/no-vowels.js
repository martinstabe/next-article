module.exports = function(){
	
	const contentPTags = document.querySelectorAll('.article__body.n-content-body p');
	
	Array.from( contentPTags ).forEach(pTag => {

		Array.from( pTag.childNodes ).forEach(child => {
			child.textContent = child.textContent.replace(/[aeiou]/gi, '');
		})
		
	});
	
}