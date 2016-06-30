const nWebpack = require('@financial-times/n-webpack');

module.exports = [
	nWebpack({
		withHeadCss: true,
		withHashedAssets: true,
		withBabelPolyfills: true,
		entry: {
			'./public/main.js': './client/main.js',
			'./public/main.css': './client/main.scss',
			'./public/main-ie8.css': './client/main-ie8.scss',
			'./public/comments.js': './client/comments.js',
			'./public/comments.css': './client/comments.scss'
		}
	}),
	nWebpack({
		withHashedAssets: true,
		withBabelPolyfills: false,
		externals: {'n-ui': true},
		entry: {
			'./public/main-without-n-ui.js': './client/main.js'
		}
	})
];
