const nWebpack = require('@financial-times/n-webpack');

module.exports = nWebpack({
	withHeadCss: true,
	withHashedAssets: true,
	withBabelPolyfills: true,
	entry: {
		'./public/main.js': './client/main.js',
		'./public/main.css': './client/main.scss',
		'./public/comments.js': './client/comments.js',
		'./public/comments.css': './client/comments.scss'
	}
}, true)
