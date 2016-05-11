module.exports = {
	name : 'archive-ocr',
	description : 'Instead of viewing ads, help us transcribe our archive.',
	run : () => {

		const articleParent = document.querySelector('.article__body');
		const articleParas = Array.from(document.querySelectorAll('.article__body p'))
			.filter(el => el.parentNode === articleParent);

		articleParas.map(el => el.style.visibility = 'hidden');

		const ocr = document.createElement('div');

		ocr.className = 'ftlabs-ad-block__archive-ocr';

		const ocrImage = document.createElement('img');
		ocrImage.setAttribute('src', 'http://i.imgur.com/nenXmte.png')
		ocr.appendChild(ocrImage);

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
			<p>To view this article, please type the text you see in the image into the form.</p>
			<input type='text' class='o-forms-text' name='ocr-input' autocomplete='off'></input>
			<button class="o-buttons o-buttons--standout o-buttons--big" data-o-grid-colspan="full-width" type="submit" id="submit-btn">Submit</button>
		</div>`;

		articleParent.insertBefore(ocr, articleParent.firstChild);

		function showContent() {
			articleParent.removeChild(ocr)
			articleParas.map(el => el.style.visibility = '');
		}
	}
};
