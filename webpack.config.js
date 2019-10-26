const path = require('path');
const HWP = require('html-webpack-plugin');
module.exports = {
	entry: {
		game: path.join(__dirname, '/src/game.js')
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
				template: path.join(__dirname,'/src/game.html'),
				chunks: ['game']
			}
		)
	]
}