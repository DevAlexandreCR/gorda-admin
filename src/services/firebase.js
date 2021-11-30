import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import firebaseConfig from '../../firebase.config'

const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);
