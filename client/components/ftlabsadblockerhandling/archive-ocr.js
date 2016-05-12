module.exports = {
	name : 'archive-ocr',
	description : 'Instead of viewing ads, help us transcribe our archive.',
	run : () => {

		const articleParent = document.querySelector('.article__body');
		articleParent.style.display = 'none';
		articleParent.style.visibility = 'hidden';

		const ocr = document.createElement('div');

		ocr.className = 'ftlabs-ad-block__archive-ocr';

		const ocrForm = document.createElement('form');
		ocrForm.addEventListener('submit', (event) => {
			event.preventDefault();
			if (event.target['ocr-input'].value.split(' ')[1] === 'for') {
				showContent();
			} else {
				event.target['ocr-input'].value = '';
				const div = event.target.querySelector('div');
				div.classList.add('o-forms--error')
				div.addEventListener('input', () => {
					div.classList.remove('o-forms--error')
				}, {
					once: true
				})
			}
		});
		ocr.appendChild(ocrForm);

		ocrForm.innerHTML =
		`<div class='o-forms-group ftlabs-ad-block__form'>
			<p>Hello, we think you're blocking ads. This is problematic, because advertising helps fund our content. Instead of viewing ads, you can help us make sense of our archives by telling us what you think the following words are saying.</p>
			<img src='http://i.imgur.com/nenXmte.png'>
			<p>Once you've typed the words you can see, the article will be shown.</p>
			<input type='text' class='o-forms-text' name='ocr-input' autocomplete='off' placeholder='Enter text here'></input>
			<div class="o-forms-errortext">Please enter the correct text</div>
			<button class="o-buttons o-buttons--standout o-buttons--big" data-o-grid-colspan="full-width" type="submit" id="submit-btn">Submit</button>
		</div>`;

		articleParent.parentNode.insertBefore(ocr, articleParent);

		function showContent() {
			articleParent.parentNode.removeChild(ocr)
			articleParent.style.display = '';
			articleParent.style.visibility = '';
		}
	}
};
