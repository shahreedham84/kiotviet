import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";

// --- Firebase config ---
const firebaseConfig = {
  apiKey: "AIzaSyDKH545vwgFzpptWTQrZRo8oOvewJA1EQY",
  authDomain: "kiotviet-83c52.firebaseapp.com",
  databaseURL: "https://kiotviet-83c52-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "kiotviet-83c52",
  storageBucket: "kiotviet-83c52.firebasestorage.app",
  messagingSenderId: "246074890153",
  appId: "1:246074890153:web:03e5a82205892d00a156b8"
};

// --- Initialize Firebase ---
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// --- Load offline orders ---
window.tableOrders = JSON.parse(localStorage.getItem('tableOrders') || '{}');

// --- Save orders locally and push per table to Firebase ---
export function saveOrdersOnline(tableId) {
  localStorage.setItem('tableOrders', JSON.stringify(window.tableOrders));
  if(tableId && window.tableOrders[tableId]) {
    set(ref(db, `tableOrders/${tableId}`), window.tableOrders[tableId]);
  }
}

// --- Sync each table from Firebase individually ---
for(let i=1; i<=12; i++){
  const tableId = `Table ${i}`;
  onValue(ref(db, `tableOrders/${tableId}`), snapshot => {
    const data = snapshot.val() || [];
    window.tableOrders[tableId] = data;
    localStorage.setItem('tableOrders', JSON.stringify(window.tableOrders));

    if(typeof renderOrderList==='function' && window.activeTable===tableId) renderOrderList();
    if(typeof renderTables==='function') renderTables(document.querySelector('.tabs button.active')?.dataset.filter || 'all');
  });
}

// --- Optional: Auto-sync all tables every 5s ---
setInterval(()=>{
  for(let i=1;i<=12;i++){
    const tableId = `Table ${i}`;
    if(window.tableOrders[tableId]) {
      set(ref(db, `tableOrders/${tableId}`), window.tableOrders[tableId]);
    }
  }
}, 5000);