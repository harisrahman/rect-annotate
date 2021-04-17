const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const mode = process.env.NODE_ENV === 'production' ? "production" : "development";
const devMode = mode === "development";
const isHot = process.env.npm_lifecycle_event === "hot";

module.exports = {
	mode: mode,
	entry: './src/ts/index.ts',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'js/app.js',
		publicPath: '',
	},
	resolve: {
		extensions: [".ts", ".js"]
	},
	devtool: devMode ? "eval-source-map" : "source-map",
	optimization: {
		minimizer: [
			new OptimizeCssAssetsPlugin(),
			new TerserPlugin()
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "src/template.html",
			filename: "index.html",
			minify: !devMode
		}),
		new MiniCssExtractPlugin({
			filename: 'css/app.css',
		}),
		new webpack.HotModuleReplacementPlugin(),
		new CleanWebpackPlugin({
			cleanOnceBeforeBuildPatterns: ["**/*", "!.gitkeep"]
		})
	],
	module:
	{
		rules: [
			{
				test: /\.html$/i,
				loader: 'html-loader',
				options: {
					minimize: !devMode,
				},
			},
			{
				test: /\.(png|svg|jpe?g|gif)$/i,
				use: {
					loader: "file-loader",
					options: {
						name: '[name].[ext]',
						outputPath: (file) =>
						{
							return "img/" + file;
						}
					}
				}
			},
			{
				test: /\.s[ac]ss$/i,
				use: [
					isHot ? 'style-loader' : {
						loader: MiniCssExtractPlugin.loader,
						options: {
							publicPath: '../' // path to director where assets folder is located
						}
					}, //3. Extract css into files
					"css-loader", //2. Turns css into commonjs
					'sass-loader' //1. Turns sass into css
				]
			},
			{
				test: /\.ts$/i,
				use: 'ts-loader',
				include: [path.resolve(__dirname, 'src/ts/')]
			},
		]
	},
	devServer: {
		port: 3000,
		hot: true,
		contentBase: path.join(__dirname, 'dist'), //for images etc
		before(app, server)
		{
			server._watch('src/*.html'); //refresh page on html change
		}
	}
};
