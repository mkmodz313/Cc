import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager, 
  getFirestore, 
  collection, 
  onSnapshot 
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Real-world high-performance Firebase configuration supplied by user
const firebaseConfig = {
  apiKey: "AIzaSyARU9qseUGZGnrogfMIOjCh03KdAP1wQE4",
  authDomain: "fevfd-4bc42.firebaseapp.com",
  projectId: "fevfd-4bc42",
  databaseURL: "https://fevfd-4bc42-default-rtdb.firebaseio.com",
  appId: "1:429119383291:web:7dda90ea363448287f325e"
};

// Prevent duplicate initialization
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// HIGH-PERFORMANCE PERSISTENT CLIENT CACHE
// This is the absolute best solution for the "data doesn't load quickly" issue.
// By configuring persistentLocalCache with a multiple-tab manager, Firestore
// caches all fetched data (including the admin features) directly into IndexedDB.
// On next application boot, Firestore reads from local cache INSTANTLY (0ms latency)
// before completing the network roundtrip, updating the UI dynamically if changes occur.
let db;
try {
  db = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager()
    })
  });
} catch (error) {
  console.warn("Persistent cache or IndexedDB is blocked (typical in restricted browser iframes). Falling back to basic Firestore.", error);
  db = getFirestore(app);
}

const rtdb = getDatabase(app);
const auth = getAuth(app);

export { app, db, rtdb, auth };
