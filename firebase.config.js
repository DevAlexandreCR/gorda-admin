export default {
    apiKey: process.env.VUE_APP_API_KEY ?? "",
    authDomain: process.env.VUE_APP_AUTHDOMAIN ?? "gorda.local",
    projectId: process.env.VUE_APP_PROJECT_ID ?? "gorda-local",
    storageBucket: process.env.VUE_APP_STORAGE_BUCKET ?? "gorda-local",
    messagingSenderId: process.env.VUE_APP_MESSAGING_ID ?? "12345678900",
    appId: process.env.VUE_APP_APP_ID ?? "1:412940684394:web:40f1a71786e91a53040e13",
    measurementId: process.env.VUE_APP_MEASUREMENT_ID ?? "G-858886884"
}

