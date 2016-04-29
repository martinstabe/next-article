module.exports = {
	name : "Bart's Punishment",
	description : "I will not block ads.",
	run : function () {
		console.log('running bart')
		const article = Array.from(document.querySelectorAll('.article__body p'));
		const nodeCharCounts = article.map(p => {
			let sum = 0;
			return Array.from(p.childNodes).map(c => {
				sum += c.textContent.length
				return sum
			})
		})

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

		let finished = false;

		function setCharAt(str,index,chr) {
			if (index > str.length-1) return str + chr;
			return str.substr(0,index) + chr + str.substr(index+1);
		}

		function replacer () {
			setTimeout(() => {
				if (currentP === lastP && character === currentP.textContent.length && isLastBartCharacter(character)) {
					finished = true;
					return;
				}

				if (character >= currentP.textContent.length && isLastBartCharacter(character)) {
					pIndex++;
					currentP = article[pIndex];
					character = 0;
				}

				const nodes = nodeCharCounts[pIndex];

				let nodeToChange = nodes.findIndex((n) => character <= n)
				nodeToChange = nodeToChange === -1 ? nodes.length - 1 : nodeToChange;

				requestAnimationFrame(() => {

					let replacementText = currentP.childNodes[nodeToChange].textContent;
					if (nodeToChange > 0) {
						currentP.childNodes[nodeToChange].textContent = setCharAt(replacementText, character - nodeCharCounts[pIndex][nodeToChange-1] - 1, getBartCharacter(character));
					} else {
						currentP.childNodes[nodeToChange].textContent = setCharAt(replacementText, character, getBartCharacter(character));
					}
					character++;
					replacer();
				})
			}, 50)
		}
		replacer()
	}
};