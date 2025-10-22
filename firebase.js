import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDKH545vwgFzpptWTQrZRo8oOvewJA1EQY",
  authDomain: "kiotviet-83c52.firebaseapp.com",
  databaseURL: "https://kiotviet-83c52-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "kiotviet-83c52",
  storageBucket: "kiotviet-83c52.firebasestorage.app",
  messagingSenderId: "246074890153",
  appId: "1:246074890153:web:03e5a82205892d00a156b8"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export function saveOrder(orderId, orderData){
  set(ref(db, 'orders/' + orderId), orderData)
    .then(()=> console.log(`Order ${orderId} saved!`))
    .catch(err=> console.error("Firebase save error:", err));
}

export function onOrdersUpdate(callback){
  onValue(ref(db,'orders/'), snapshot=> callback(snapshot.val()));
}
