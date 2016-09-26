module.exports = {
	"defaults": {
		"timeout": 1000,
		"page": {
			"viewport": {
				"width": 320,
				"height": 480
			}
		}
	},
	"urls": [
		{
			"url": process.env.TEST_URL + "content/a70ccc2e-8093-11e6-8e50-8ec15fb462f4",
			"timeout": 10000
		}
	]
}
