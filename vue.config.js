const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath:"./",
  outputDir: "docs",

  devServer: {
    host: 'localhost',
    port: 8001,
    open: true,
    proxy: {
      "/api": {
        target: "https://ais.msa.gov.cn",
        changeOrigin: true,
      },
    }
  },

})
