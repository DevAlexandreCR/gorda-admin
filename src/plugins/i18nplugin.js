import { createI18n } from 'vue-i18n'



export default {
    install: (app) => {
      const messages = {
        en: {
          message: {
            hello: 'hello world'
          }
        },
        es: {
          message: {
            hello: 'Hola Mundo'
          }
        }
      }
      const i18n = createI18n({
        locale: 'es', // set locale
  fallbackLocale: 'en',
  messages: messages
      })
      app.provide('trans', i18n)
    }
  }