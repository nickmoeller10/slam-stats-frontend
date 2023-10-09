import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDjofl67qzv3Hvd13xAcY9L9-bBYodL3Cg",
  authDomain: "slam-stats.firebaseapp.com",
  projectId: "slam-stats",
  storageBucket: "slam-stats.appspot.com",
  messagingSenderId: "757028064661",
  appId: "1:757028064661:web:44b2862f28921abc0b7a9c",
  measurementId: "G-5KG1DNSWLD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
