const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath:"./",
  outputDir: "docs",

  devServer: {
    host: 'localhost',
    port: 8001,
    open: true,
    // proxy: {
    //   "/ship": {
    //     target: "https://www.shipxy.com",
    //     changeOrigin: true,
    //   },
    // }
  },

})
