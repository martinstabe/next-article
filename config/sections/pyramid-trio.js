export default (name, trackScrollEvent) => ({
	id: name ? name.title : 'pyramid-trio',
	title: name ? `<a href="${name.url}" class="section-meta__link" data-trackable="section-title">${name.title}</a>` : null,
	style: 'pyramid-trio',
	layoutId: 'pyramid-trio',
	trackable: 'pyramid-trio',
	trackScrollEvent: trackScrollEvent,
	size: {
		default: 12
	},
	cols: {
		content: {
			default: 12
		}
	}
})
