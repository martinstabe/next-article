export default () => ([
	{
		type: 'Row',
		components: [
			{
				type: 'Column',
				colspan: { default: 12 },
				components: [
					{
						type: 'Content',
						size: 'medium',
						standfirst: {
							show: { default: true}
						},
						image: {
							position: {
								M: 'right'
							},
							widths: [345, 380],
							sizes: {
								M: '345px',
								XL: '380px'
							}
						}
					}
				]
			},
			{
				type: 'Column',
				colspan: { default: 12, M: 6 },
				components: [
					{
						type: 'Content',
						size: 'small',
						standfirst: {
							show: { default: true}
						}
					}
				]
			},
			{
				type: 'Column',
				colspan: { default: 12, M: 6 },
				components: [
					{
						type: 'Content',
						size: 'small',
						standfirst: {
							show: { default: true}
						}
					}
				]
			}
		]
	}
]);
