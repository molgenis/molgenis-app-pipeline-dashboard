const packageJson = require('./package.json')
const pkgName = packageJson.name

const target = 'https://trace-acc.gcc.rug.nl'

module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: `
        @import 'bootstrap/scss/bootstrap';
        @import 'bootstrap-vue/src/index.scss';
        `
      }
    }
  },
  outputDir: 'dist',
  publicPath: process.env.NODE_ENV === 'production' ? pkgName + '/dist/' : '/',
  devServer: {
    // In CI mode, Safari cannot contact "localhost", so as a workaround, run the dev server using the jenkins agent pod dns instead.
    host: process.env.JENKINS_AGENT_NAME || 'localhost',
    proxy: process.env.NODE_ENV === 'production' ? undefined : {
      '^/api': {
        target,
        changeOrigin: true
      },
      '^/login': {
        target,
        changeOrigin: true
      }
    }
  },
  configureWebpack: {
    devtool: 'source-map'
  }
  
}
