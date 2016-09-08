export default (name, trackScrollEvent) => {
	const meta = name ? { default: 12 } : null;
	return {
		id: name && name.title ? name.title : 'onward-journey',
		title: name && name.title ? `<div class="section-meta__link" data-trackable="section-title">${name.title}</div>` : null,
		style: 'onward-journey',
		layoutId: 'onward-journey',
		trackable: 'onward-journey',
		trackScrollEvent: trackScrollEvent,
		size: {
			default: 12
		},
		cols: {
			content: {
				default: 12
			},
			meta
		}
	};
}
