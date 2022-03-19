// import { defineConfig } from "@vue/cli-service";

module.exports = {
    devServer: {
      watchOptions: {
        ignored: ['node_modules'],
        aggregateTimeout: 300,
        poll: 1500,
      },
      public: '192.168.1.5:3000',
    },
    assetsDir: 'static',
    indexPath: process.env.VUE_APP_STAGING ?  'staging.html' : 'index.html'
  };
  