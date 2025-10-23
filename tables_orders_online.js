// ============================
// 🧾 KIOTVIET - Tables + Orders (Firestore Sync)
// ============================

import { saveOrdersOnline } from "./firebase.js";

// --- Globals ---
window.tableOrders = JSON.parse(localStorage.getItem("tableOrders") || "{}");
window.activeTable = null;

// --- Initialize UI ---
export function initTablesOrders() {
  renderTables("all");
}

// --- Render Tables Grid ---
export function renderTables(filter = "all") {
  const grid = document.getElementById("tableGrid");
  if (!grid) return;

  grid.innerHTML = "";

  for (let i = 1; i <= 12; i++) {
    const tableId = `Table ${i}`;
    const orders = window.tableOrders[tableId] || [];
    const total = orders.reduce((sum, o) => sum + (o.price || 0) * (o.qty || 1), 0);

    const isInUse = orders.length > 0;
    if (filter === "inuse" && !isInUse) continue;
    if (filter === "available" && isInUse) continue;

    const div = document.createElement("div");
    div.className = `table-card ${isInUse ? "inuse" : "available"}`;
    div.innerHTML = `
      <div class="table-name">${tableId}</div>
      <div class="table-total">${isInUse ? total.toLocaleString() + " ₫" : "Empty"}</div>
    `;

    div.addEventListener("click", () => openOrderScreen(tableId));
    grid.appendChild(div);
  }
}

// --- Open Order Screen ---
export function openOrderScreen(tableId) {
  const orderScreen = document.getElementById("orderScreen");
  const mainScreen = document.getElementById("mainScreen");
  const tableName = document.getElementById("currentTable");
  const orderList = document.getElementById("orderList");

  if (!orderScreen || !mainScreen) return;

  window.activeTable = tableId;
  tableName.textContent = tableId;
  mainScreen.style.display = "none";
  orderScreen.style.display = "flex";

  renderOrderList();

  document.getElementById("closeOrder").onclick = () => {
    mainScreen.style.display = "block";
    orderScreen.style.display = "none";
    window.activeTable = null;
    renderTables(document.querySelector(".tabs button.active")?.dataset.filter || "all");
  };
}

// --- Render Order List ---
export function renderOrderList() {
  const orderList = document.getElementById("orderList");
  if (!orderList) return;

  const tableId = window.activeTable;
  const orders = window.tableOrders[tableId] || [];

  orderList.innerHTML = orders
    .map(
      (item, i) => `
    <div class="order-item">
      <span>${item.name}</span>
      <span>${item.qty} x ${item.price.toLocaleString()} ₫</span>
      <button onclick="removeOrderItem(${i})">🗑️</button>
    </div>
  `
    )
    .join("");

  const total = orders.reduce((sum, o) => sum + (o.price || 0) * (o.qty || 1), 0);
  document.getElementById("totalAmount").textContent = total.toLocaleString() + " ₫";
}

// --- Add Item to Current Table ---
export function addOrderItem(name, price) {
  const tableId = window.activeTable;
  if (!tableId) return;

  window.tableOrders[tableId] = window.tableOrders[tableId] || [];
  window.tableOrders[tableId].push({ name, price, qty: 1 });

  saveOrdersLocally();
  saveOrdersOnline(tableId);
  renderOrderList();
  renderTables();
}

// --- Remove Item from Table ---
window.removeOrderItem = function (index) {
  const tableId = window.activeTable;
  if (!tableId || !window.tableOrders[tableId]) return;

  window.tableOrders[tableId].splice(index, 1);
  if (window.tableOrders[tableId].length === 0) delete window.tableOrders[tableId];

  saveOrdersLocally();
  saveOrdersOnline(tableId);
  renderOrderList();
  renderTables();
};

// --- Local Save ---
function saveOrdersLocally() {
  localStorage.setItem("tableOrders", JSON.stringify(window.tableOrders));
}

// --- Auto-Sync + Create Tables in Firestore ---
export async function autoSyncAll() {
  for (let i = 1; i <= 12; i++) {
    const tableId = `Table ${i}`;
    if (!window.tableOrders[tableId]) {
      // Create empty table automatically if missing
      window.tableOrders[tableId] = [];
    }
    await saveOrdersOnline(tableId);
  }
}

// --- Optional periodic auto-sync (every 10s) ---
setInterval(() => {
  autoSyncAll();
}, 10000);

// --- Auto init after DOM ready ---
document.addEventListener("DOMContentLoaded", () => {
  initTablesOrders();
});
