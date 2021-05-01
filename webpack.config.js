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
		filename: 'js/rect-annotate.js',
		publicPath: '',
		library: {
			type: "umd"
		}
	},
	resolve: {
		extensions: [".ts", ".js"]
	},
	devtool: devMode ? "eval-source-map" : "source-map",
	optimization: {
		minimize: !devMode,
		minimizer: [
			new OptimizeCssAssetsPlugin(),
			new TerserPlugin({
				terserOptions: {
					mangle: true,
					keep_fnames: false,
					keep_classnames: false
				},
			}),
		],
		splitChunks: {
			cacheGroups: {
				app: {
					name: 'rect-annotate',
					type: 'css/mini-extract',
					test: /app\.s?css$/,
					chunks: 'all',
					enforce: true,
				}
			},
		},
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "src/template.html",
			filename: "index.html",
			inject: "head",
			scriptLoading: "blocking",
			minify: !devMode
		}),
		new MiniCssExtractPlugin({
			filename: ({ chunk }) =>
			{
				const name = chunk.name == "main" ? "demo" : chunk.name;

				return `css/${name}.css`;
			},
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
					esModule: false
				},
			},
			{
				test: /\.(png|svg|jpe?g|gif|ico)$/i,
				use: {
					loader: "file-loader",
					options: {
						name: '[name].[ext]',
						outputPath: 'img'
					}
				}
			},
			{
				test: /demo.js$/i,
				use: {
					loader: "file-loader",
					options: {
						name: '[name].[ext]',
						outputPath: 'js'
					}
				}
			},
			{
				test: /\.s[ac]ss$/i,
				use: [
					isHot ? 'style-loader' : {
						loader: MiniCssExtractPlugin.loader,
						options: {
							publicPath: '../'
						}
					},
					"css-loader",
					'sass-loader'
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
		contentBase: path.join(__dirname, 'dist'),
		before(app, server)
		{
			server._watch('src/*.html');
		}
	}
};
