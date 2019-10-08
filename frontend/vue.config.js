module.exports = {
  productionSourceMap: false,
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000/'
      },
      '/static': {
        target: 'http://localhost:3000/'
      }
    }
  },
  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.whitespace = 'condense'
        return options
      })

    config
      .plugin('html')
      .tap(options => {
        options[0].minify = {
          collapseWhitespace: true,
          removeComments: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true,
          minifyCSS: true
        }
        return options
      })
  }
}
