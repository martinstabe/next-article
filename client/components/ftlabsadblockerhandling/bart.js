module.exports = {
	name : "Bart's Punishment",
	description : "I will not block ads. I will not block ads.",
	run : function () {
		const article = Array.from(document.querySelectorAll('.article__body p'));

		const lastP = article[article.length -1];

		let character = 0;
		let pIndex = 0;
		let currentP = article[pIndex];
		const phrase = 'I will not block ads. ';

		function getBartCharacter(position) {
			const pos = position % phrase.length;
			return phrase[pos];
		}

		function isLastBartCharacter(position) {
			const pos = position % phrase.length;
			return pos === phrase.length - 1;
		}

		function setCharAt(str,index,chr) {
			if (index > str.length-1) return str + chr;
			return str.substr(0,index) + chr + str.substr(index+1);
		}

		function replacer () {
			setTimeout(() => {
				if (currentP === lastP && character === currentP.textContent.length && isLastBartCharacter(character)) {
					return;
				}

				if (character >= currentP.textContent.length && isLastBartCharacter(character)) {
					pIndex++;
					currentP = article[pIndex];
					character = 0;
				}
				requestAnimationFrame(() => {
					let replacementText = currentP.textContent;
					currentP.textContent = setCharAt(replacementText, character, getBartCharacter(character));
					character++;
					replacer();
				})
			}, 50)
		}

		replacer()
	}
};
