module.exports = function ($, flags, adsLayout) {
	const pars = $('p');
	pars.each((index, par) => {
		if(index > 1 && par.next && par.next.name === 'p' && !par.parent) {
			
			var mu = `<div class="o-ads in-article-advert ad-blocked"
				data-o-ads-name="mpu"
				data-o-ads-center="true"
				data-o-ads-label="true"
				data-o-ads-targeting="pos=${adsLayout === 'default' ? 'mpu' : 'mid'};"
				data-o-ads-formats-default="MediumRectangle,Responsive"
				data-o-ads-formats-small="MediumRectangle,Responsive"
				data-o-ads-formats-medium="MediumRectangle,Responsive"
				data-o-ads-formats-large="Responsive"
				data-o-ads-formats-extra="Responsive"
			$(par).after(extra="Responsive"
				aria-hidden="true"></div>`;
			
			// console.log(flags);
			
			if(flags.ftlabsAdBlockerHandling){
				mu += `<script>
						document.body.addEventListener('adsblocked', function(){
							console.log("adsblock event recieved. Inserting replacement content...");
							document.querySelector('.o-ads.in-article-advert').innerHTML = repContent['300'];
						}, false);
						
					<\/script>`
			}
			
			$(par).after(mu);
			return false;
		}
	});

	return $;
};
