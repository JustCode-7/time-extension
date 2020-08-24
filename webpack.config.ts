import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import * as path from 'path';
import TerserPlugin from 'terser-webpack-plugin';
import * as webpack from 'webpack';


const defaultConfig: webpack.Configuration = {
  mode: 'production',
  entry: './overwrite-me.ts',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  target: 'web',
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: true,
          ie8: false,
          keep_classnames: false,
          keep_fnames: false,
          sourceMap: true, // TODO conditionally toggle?
          output: {
            comments: false,
          },
        },
        extractComments: false,
      }),
    ],
  },
};

const extensionConfig: webpack.Configuration = {
  ...defaultConfig,
  mode: 'production',
  entry: './src/background/background.ts',
  plugins: [
    new CleanWebpackPlugin({ dry: true, verbose: false, protectWebpackAssets: true }), // this somehow screws up the content-script from being generated or saved.
    new CopyPlugin({ patterns: ['src/manifest.json', 'node_modules/tachyons/css/tachyons.min.css'] }),
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'background.bundle.js',
  },
};

const contentScriptsConfig: webpack.Configuration = {
  ...defaultConfig,
  entry: './src/content-scripts/index.cs.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'content-scripts.bundle.js',
  },
};

const config = [extensionConfig, contentScriptsConfig];

// noinspection JSUnusedGlobalSymbols
export default config;
