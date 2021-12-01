import firebaseConfig from '../../firebase.config'
import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
logEvent(analytics, 'notification_received');






