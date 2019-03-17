const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { HotModuleReplacementPlugin, DefinePlugin } = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = (_, { mode }) => {
  const isDevelopment = mode === 'development';

  return {
    entry: './front/js/index.jsx',

    optimization: {
      minimizer: [
        new OptimizeCSSAssetsPlugin(),
      ],
    },

    output: {
      path: path.resolve(__dirname, 'public'),
      filename: '[name].js',
      publicPath: '/',
    },

    resolve: {
      extensions: ['.jsx', '.js', 'less'],
    },

    module: {
      rules: [
        {
          test: /\.jsx$/,
          loader: 'babel-loader',
        },
        {
          test: /\.less$/,
          loaders: [
            isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                plugins: [autoprefixer],
              },
            },
            'less-loader',
          ],
        },
      ],
    },

    plugins: [
      new DefinePlugin({
        NODE_ENV: isDevelopment ? JSON.stringify('development') : JSON.stringify('production'),
      }),
      new HtmlWebpackPlugin({
        template: './front/index.html',
        hash: true,
      }),
      new HotModuleReplacementPlugin(),
      new MiniCssExtractPlugin(),
    ],

    devServer: {
      contentBase: __dirname,
      port: 3000,
      hot: true,
      open: true,
    },

    devtool: isDevelopment ? 'inline-cheap-module-source-map' : false,
  };
};
