module.exports = {
	name : "Ads-Facts",
	description : "The most educated ad-blocking user",
	run : function () {
		console.log('running multi-page')
		const parts = new Map()
		parts.set(1, `<div class="ftlabs-ad-block-handling-ui">
			<h1>Thanks for subscribing to Ad Facts!</h1>
			<p><small>To unsubscribe from ad facts, <a href=# >whitelist</a> the FT on your adblocker</small></p>
		</div>`)
		parts.set(2, `<div class="ftlabs-ad-block-handling-ui">
			<h1>AD FACT #1</h1>
			<p><strong>Ads generate 52% of our revenue!</strong></p>
			<p><small>To unsubscribe from ad facts, <a href=# >whitelist</a> the FT on your adblocker</small></p>
		</div>`)
		parts.set(3,`<div class="ftlabs-ad-block-handling-ui">
			<h1>AD FACT #42</h1>
			<p><strong>An ad a day keeps Sky News at bay.</strong></p>
			<p><small>To unsubscribe from ad facts, <a href=# >whitelist</a> the FT on your adblocker</small></p>
		</div>`)
		parts.set(4,`<div class="ftlabs-ad-block-handling-ui">
			<h1>AD FACT #2</h1>
			<p><strong>Without ads, subscriptions would cost 300% more!</strong></p>
			<p><small>To unsubscribe from ad facts, <a href=# >whitelist</a> the FT on your adblocker</small></p>
		</div>`)

		let part = parseInt(localStorage.getItem('ftlabsAdBlockerLongGame'), 10);

		if (!part) {
			part = 1
		}
		console.log(parts.length)
		const adspace = document.querySelector('.sidebar-advert');
		// const img = document.createElement('img');
		// img.src = parts.get(part);
		adspace.innerHTML = parts.get(part);
		part = part === 4 ? 1 : part + 1;

		localStorage.setItem('ftlabsAdBlockerLongGame', part);
	}
};