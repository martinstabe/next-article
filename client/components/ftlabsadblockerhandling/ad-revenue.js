function count (string) {
	string = string.replace(/<\/?[a-z][^>]*>/gi, '')
	string = string.replace(/[\u200B]+/, '')

	return string.replace(/['";:,.?¿\-!¡]+/g, '').split(' ')
}

module.exports = {
	name : `Ad-Revenue`,
	description : `Remove the percentage of words equivalent to the proportion of revenue we've lost from ad-blocking`,
	run : function () {

		const articleParas = Array.from(document.querySelectorAll('.article__body p'))
			.filter(p => p.parentNode.className.match(/article__body/));

		const totalTextLength = articleParas.reduce((p, n) => p + count(n.textContent).length, 0);
		const percentOfRevenueGatheredFromAds = 0.5;
		const newTextLength = Math.floor(totalTextLength * percentOfRevenueGatheredFromAds);

		for (var i = 0; i < newTextLength; i++) {
			const p = articleParas[Math.random() * articleParas.length | 0];
			const replacementText = p.textContent;
			const words = count(replacementText)
			const wordToRemove = words[Math.random() * words.length | 0];

			p.textContent = replacementText.replace(new RegExp(`\\b${wordToRemove}\\b`), new Array(wordToRemove.length).fill('_').join(''));
		}
	}
};
