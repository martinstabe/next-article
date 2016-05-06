module.exports = {
	name : "No Vowels",
	description : "No Ads => No Vowels",
	run : function(){

		const articleParas = Array.from(document.querySelectorAll('.article__body p'))
			.filter(p => p.parentNode.className.match(/article__body/));

		articleParas.forEach(p => {
			Array.from( p.childNodes ).forEach(child => {
				child.textContent = child.textContent.replace(/[aeiou]/gi, '');
			})
		});

	}
};
