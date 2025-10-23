// ============================
// 🔥 Firebase Firestore version (replaces Realtime Database)
// ============================

// Load Firebase via CDN (modular v12+)
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  onSnapshot,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

// --- Firebase Config ---
const firebaseConfig = {
  apiKey: "AIzaSyCkY1iwprnsEUgyFAjl0bOIUPU46R4YRjo",
  authDomain: "kiotviet-a41b1.firebaseapp.com",
  projectId: "kiotviet-a41b1",
  storageBucket: "kiotviet-a41b1.firebasestorage.app",
  messagingSenderId: "166511834957",
  appId: "1:166511834957:web:d24f894f9d26bafddca904",
};

// --- Initialize Firebase ---
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- Save a single order (same API as before) ---
export async function saveOrder(orderId, orderData) {
  try {
    await setDoc(doc(db, "orders", orderId), orderData, { merge: true });
    console.log(`✅ Order ${orderId} saved to Firestore`);
  } catch (err) {
    console.error("❌ Firestore save error:", err);
  }
}

// --- Realtime listener for all orders ---
export function onOrdersUpdate(callback) {
  const ordersCol = collection(db, "orders");
  onSnapshot(ordersCol, (snapshot) => {
    const data = {};
    snapshot.forEach((doc) => {
      data[doc.id] = doc.data();
    });
    callback(data);
  });
}

// --- Optional: load all existing orders once ---
export async function getAllOrders() {
  const ordersCol = collection(db, "orders");
  const snapshot = await getDocs(ordersCol);
  const data = {};
  snapshot.forEach((doc) => {
    data[doc.id] = doc.data();
  });
  return data;
}
