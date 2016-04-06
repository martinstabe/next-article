module.exports = function ($) {
	const pars = $('p');
	pars.each((index, par) => {
		if(index > 1 && par.next && par.next.name === 'p') {
			$(par).after(`<div class="o-ads in-article-advert"
				data-o-ads-name="mpu"
				data-o-ads-center="true"
				data-o-ads-label="true"
				data-o-ads-targeting="pos=mpu;"
				data-o-ads-formats-default="MediumRectangle,Responsive"
				data-o-ads-formats-small="MediumRectangle,Responsive"
				data-o-ads-formats-medium="MediumRectangle,Responsive"
				data-o-ads-formats-large="Responsive"
				data-o-ads-formats-extra="Responsive"
				aria-hidden="true"></div>`);
			return false;
		}
	});

	return $;
};
