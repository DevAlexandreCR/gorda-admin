module.exports = {
  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableLegacy: false,
      runtimeOnly: false,
      compositionOnly: true,
      fullInstall: true
    },
    chainWebpack: config => {
      config.module
        .rule('vue')
        .use('vue-loader')
        .tap(options => ({
          ...options,
          compilerOptions: {
            isCustomElement: tagName => {
              return tagName === 'vue-advanced-chat' || tagName === 'emoji-picker'
            }
          }
        }))
    }
  }
}
