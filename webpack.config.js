const path = require("path");
const webpack = require("webpack");
const BrotliGzipPlugin = require("brotli-gzip-webpack-plugin");
const SWPreCacheWebpackPlugin = require("sw-precache-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');


module.exports = {
    entry: path.join(__dirname, "/src/index.js"),
    output: {
        filename: "[name].js",
        path: path.join(__dirname, "/build/static/js"),
    },
    resolve: {
        extensions: ["*", ".js", ".jsx"],
    },

    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                options: { presets: ['@babel/env','@babel/preset-react'] },
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    // plugins: [
    //     new webpack.ProvidePlugin({
    //         React: "react",
    //     }),
    //     new BrotliGzipPlugin({
    //         asset: '[path].br[query]',
    //         algorithm: 'brotli',
    //         test: /\.(js|css|html|svg)$/,
    //         threshold: 10240,
    //         minRatio: 0.8,
    //         quality: 11
    //     }),
    //     new BrotliGzipPlugin({
    //         asset: '[path].gz[query]',
    //         algorithm: 'gzip',
    //         test: /\.(js|css|html|svg)$/,
    //         threshold: 10240,
    //         minRatio: 0.8
    //     })
    // ],
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendors",
                    chunks: "all",
                },
            },
        },
        minimize: true,
        minimizer: [
            new TerserPlugin({
                test: /\.js(\?.*)?$/i,
            }),
        ],
    },
    // devtool: "cheap-module-eval-source-map",
};