module.exports = {
	name : "Bart's Punishment",
	description : "I will not block ads. I will not block ads.",
	run : function () {
		const articleParas = Array.from(document.querySelectorAll('.article__body p'))
			.filter(p => p.parentNode.className.match(/article__body/));

		const lastP = articleParas[articleParas.length -1];

		let character = 0;
		let pIndex = 0;
		let currentP = articleParas[pIndex];
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
					currentP = articleParas[pIndex];
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
