module.exports = {
	name : "Intra Word Shuffle",
	description : "Shuffling up the characters of the words.",
	run : () => {

		function shuffle(array) {
			let currentIndex = array.length;
			let temporaryValue;
			let randomIndex;

			while (currentIndex !== 0) {

			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			// And swap it with the current element.
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
			}
			return array.join('');
		}

		const articleParent = document.querySelector('.article__body');
		const articleParas = Array.from(document.querySelectorAll('.article__body p'))
			.filter(el => el.parentNode === articleParent);

		articleParas.forEach(para => {
			const words = para.textContent.split(' ');
			let newWords = words.map(word => {
				const specialChars = ["“", "”", ".", ";", ":", "!", "£", "$", "€", "-"];
				if (word.length > 3) {
					const letters = word.split('');
					let firstChars = letters.shift();
					if (specialChars.includes(firstChars)) {
						firstChars = firstChars + letters.shift();
					}
					let lastChars = letters.pop();
					if (specialChars.includes(lastChars)) {
						lastChars = letters.pop() + lastChars;
					}
					const shuffledChars = letters.length > 1 ? shuffle(letters) : letters;
					word = firstChars + shuffledChars + lastChars;
				}
				return word;
			});
			newWords = newWords.join(' ');
			para.textContent = newWords;
		});
	}
};
