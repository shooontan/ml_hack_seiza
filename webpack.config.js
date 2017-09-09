const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const precss = require('precss');
const autoprefixer = require('autoprefixer');

module.exports = [
    {
        entry: {
            bundle: ['babel-polyfill', './src/index.js']
        },
        output: {
            path: path.join(__dirname, 'public/javascripts'),
            filename: '[name].js'
        },
        module: {
            loaders: [
                {
                    loader: 'babel-loader',
                    exclude: /node_modules/,
                    test: /\.js[x]?$/,
                    query: {
                        cacheDirectory: true,
                        presets: ['react', 'es2015']
                    }
                }
            ]
        }
    },
    {
        entry: {
            style: './src/style.scss'
        },
        output: {
            path: path.join(__dirname, 'public/stylesheets'),
            filename: '[name].css'
        },
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: [
                            {
                                loader: 'css-loader',
                                options: {
                                    url: false,
                                    minimize: true
                                }
                            },
                            'postcss-loader'
                        ]
                    })
                },
                {
                    test: /\.scss$/,
                    use: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: [
                            {
                                loader: 'css-loader',
                                options: {
                                    url: false,
                                    minimize: true
                                }
                            },
                            'postcss-loader',
                            'sass-loader'
                        ]
                    })
                }
            ]
        },
        plugins: [
            new ExtractTextPlugin({
                filename: '[name].css'
            }),
            new webpack.LoaderOptionsPlugin({
                options: {
                    postcss: [
                        require('autoprefixer')({
                            browsers: ['last 2 versions']
                        })
                    ]
                }
            })
        ]
    }
];