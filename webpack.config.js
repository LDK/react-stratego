const path = require('path');
const HWP = require('html-webpack-plugin');
module.exports = {
	entry: {
		app: path.join(__dirname, '/src/app.js')
	},
	output: {
		filename: 'build.js',
		path: path.join(__dirname, '/dist')
	},
	module:{
		rules:[{
			test: /\.js$/,
			exclude: /node_modules/,
			loader: 'babel-loader'
		}]
	},
	plugins:[
		new HWP(
			{
				filename: 'index.html',
				template: path.join(__dirname,'/src/stratego.html'),
				chunks: ['app']
			}
		)
	]
}