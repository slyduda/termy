// import { defineConfig } from "@vue/cli-service";

module.exports = {
  assetsDir: 'static',
  indexPath: process.env.VUE_APP_STAGING ? 'staging.html' : 'index.html',
};
