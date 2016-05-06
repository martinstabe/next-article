module.exports = {
	name : "No Vowels",
	description : "No Ads => No Vowels",
	run : function(){

		const contentPTags = document.querySelectorAll('.article__body p');
		Array.from( contentPTags ).forEach(pTag => {
			Array.from( pTag.childNodes ).forEach(child => {
				child.textContent = child.textContent.replace(/[aeiou]/gi, '');
			})
		});

	}
};
