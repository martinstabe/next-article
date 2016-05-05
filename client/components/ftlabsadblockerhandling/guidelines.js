const markup = `
	<div class="ftlabs-ad-block__guidelines">
		<p>The FT takes a strong approach to only showing adverts that have little interference with your enjoyment of our website.</p>
		<p>These are the guidelines that each advert must meet.</p>
		<ul>
			<li>First</li>
			<li>Second</li>
			<li>Third</li>
			<li>Fourth</li>
		</ul>
		<p>Please consider 'whitelisting' the FT within your ad-blocker.</p>
	</div>
`;

module.exports = {
	name : "guidelines",
	description : "We have strict rules around what adverts we show",
	run : function (){

		const adSpace = document.querySelector('.sidebar-advert.o-ads');
		adSpace.innerHTML = markup;

	}
};
