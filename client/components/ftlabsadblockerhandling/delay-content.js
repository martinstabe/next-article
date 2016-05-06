module.exports = {
	name : "delayed-content",
	description : "We'll Make You Wait",
	run : () => {

		const articleParent = document.querySelector('.article__body');
		const articleParas = Array.from(document.querySelectorAll('.article__body p'))
			.filter(el => el.parentNode === articleParent);

		articleParas.map(el => el.style.display = 'none');

		const adMessage = document.createElement('div');
		adMessage.innerHTML = '<p class="ftlabs-ad-block__delay-content">This article will be back shortly. We have delayed your access to it for a short while because we believe you are using ad blocking technology. The FT generates income from advertising on the site which helps ensure we can bring you intesting content like the article you will shortly be reading.</p>';
		articleParent.insertBefore(adMessage, articleParent.firstChild);

		function showContent() {
			adMessage.style.display = 'none';
			articleParas.map(el => el.style.display = 'block');
		}

		window.setTimeout(showContent, 10000);
	}
};
