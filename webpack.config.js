const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');

// 生成多个实例，base存放第三方库，app为自定义
let baseCss = new ExtractTextWebpackPlugin('css/base-[contenthash:6].css');
let appCss = new ExtractTextWebpackPlugin('css/app-[contenthash:6].css');

module.exports = {

    // 入口文件路径
    entry: {
        app: __dirname + '/bootstrap.js',
        vendor: ['jquery']
    },

    // 输出
    output: {
        path: __dirname + '/dist',
        filename: 'js/[name]-[chunkhash:6].js',
        publicPath: '/'
    },

    // 本地服务器
    devServer: {
        // 服务器文件路径
        contentBase: __dirname + '/dist',
        // 开启GZIP
        // compress: true
    },

    module: {

        // 规则
        rules: [{
            test: /\.js$/,
            use: [{
                loader: 'babel-loader',
                options: {
                    presets: ['es2015']
                }
            }],
            // 排除文件夹
            exclude: /node_modules/
        }, {
            test: /\.(css|less)$/,
            // 合并
            use: appCss.extract({
                fallback: 'style-loader',
                use: [{
                        loader: 'css-loader',
                        options: {
                            // 启用压缩
                            // minimize: true
                        }
                    },
                    { loader: 'less-loader' }
                ]
            }),
            // 排除第三方库
            exclude: /node_modules/
        }, {
            test: /\.css$/,
            // 合并
            use: baseCss.extract({
                fallback: 'style-loader',
                use: [{
                    loader: 'css-loader',
                    options: {
                        // 启用压缩
                        // minimize: true
                    }
                }]
            }),
            // 限制第三方库
            include: /node_modules/
        }, {
            // 加载css中的字体或图片
            test: /(\.ttf|\.woff2|\.woff|\.eot|\.svg|\.dtd|\.png|\.jpg)/,
            use: [{
                loader: "file-loader",
                // options: {
                //     limit: '1024'
                // } 
            }]
        }, {
            // 将html文件转换为字符串
            test: /\.html$/,
            use: [{
                loader: "raw-loader"
            }]
        }, {
            test: require.resolve('jquery'),
            use: [{
                    loader: 'expose-loader',
                    options: 'jQuery'
                },
                {
                    loader: 'expose-loader',
                    options: '$'
                }
            ]
        }, {
            test: require.resolve('lodash'),
            use: [{
                loader: 'expose-loader',
                options: '_'
            }]
        }],
    },

    // plugins
    plugins: [

        // 生成默认模板
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './index.html'
        }),

        // 清空打包目录
        new CleanWebpackPlugin(['dist/**/**'], {
            root: __dirname,
            verbose: true,
            dry: false
        }),

        // 提取公共模块
        new webpack.optimize.CommonsChunkPlugin({

            // 对应entry数组vender
            name: 'vendor',
            filename: 'js/vendor-[chunkhash:6].js',

            // 保证没有其他模块打包进该模块
            minChunks: Infinity
        }),

        // 合并css
        baseCss, appCss,
    ]
};