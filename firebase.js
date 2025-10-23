// ============================
// 🔥 KIOTVIET Firestore Sync (Multi-user + Offline Ready)
// ============================

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

// --- Save each table’s order ---
export async function saveOrdersOnline(tableId) {
  if (!window.tableOrders || !window.tableOrders[tableId]) return;
  try {
    await setDoc(doc(db, "tables", tableId), {
      orders: window.tableOrders[tableId],
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    console.log(`✅ Synced ${tableId} to Firestore`);
  } catch (err) {
    console.error("❌ Firestore sync error:", err);
  }
}

// --- Listen for live updates from Firestore ---
export function startRealtimeSync() {
  const tablesCol = collection(db, "tables");
  onSnapshot(tablesCol, (snapshot) => {
    const data = {};
    snapshot.forEach((doc) => {
      data[doc.id] = doc.data().orders || [];
    });
    // Merge into local memory
    window.tableOrders = data;
    localStorage.setItem("tableOrders", JSON.stringify(window.tableOrders));
    console.log("🔄 Realtime sync:", data);

    // Refresh UI if available
    if (typeof renderTables === "function")
      renderTables(document.querySelector(".tabs button.active")?.dataset.filter || "all");
    if (typeof renderOrderList === "function" && window.activeTable)
      renderOrderList();
  });
}
