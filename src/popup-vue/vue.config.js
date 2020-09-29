module.exports = {
  outputDir: '../../dist/popup',
  // publicPath: process.env.NODE_ENV === 'production' ? '/popup/' : '/',
  publicPath: process.env.NODE_ENV === 'development' ? '/popup/' : '/',
  configureWebpack: {
    devtool: 'source-map',
  },
};
