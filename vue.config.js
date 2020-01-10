const packageJson = require('./package.json')
const pkgName = packageJson.name

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
        target: 'https://molgenis96.gcc.rug.nl',
        changeOrigin: true
      },
      '^/login': {
        target: 'https://molgenis96.gcc.rug.nl',
        changeOrigin: true
      }
    }
  },
  configureWebpack: {
    devtool: 'source-map'
  }
  
}
