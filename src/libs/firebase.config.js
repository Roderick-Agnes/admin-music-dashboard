import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCOon_vSEHEdDFzQXM0gACxDSjpC74Byqw",
  authDomain: "cmusic-firebase.firebaseapp.com",
  projectId: "cmusic-firebase",
  storageBucket: "cmusic-firebase.appspot.com",
  messagingSenderId: "471157188651",
  appId: "1:471157188651:web:3787034761ae2f0787a26e",
};
//   databaseURL: 'https://project-id.firebaseio.com',

// if (!firebase.apps.length) {
//   firebase.initializeApp(firebaseConfig);
// }
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
