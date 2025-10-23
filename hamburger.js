function initHamburgerMenu(button, onClearAll) {
  if (!button) return;

  // Ensure button is on top and clickable
  Object.assign(button.style, {
    cursor: "pointer",
    userSelect: "none",
    position: "relative",
    zIndex: "10000", // force top layer
    pointerEvents: "auto",
  });

  // Create popup (only once)
  let popup = document.getElementById("menuPopup");
  if (!popup) {
    popup = document.createElement("div");
    popup.id = "menuPopup";
    Object.assign(popup.style, {
      position: "absolute",
      top: "45px",
      left: "10px",
      background: "#fff",
      border: "1px solid #ddd",
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      padding: "10px",
      display: "none",
      zIndex: "9999",
    });

    popup.innerHTML = `
      <button id="clearAllTables"
        style="width:180px;padding:10px;background:#ff3b30;color:#fff;
               border:none;border-radius:6px;font-weight:bold;">
        🧹 Clear All Tables
      </button>
    `;
    document.body.appendChild(popup);
  }

  // Safe toggle handler
  button.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Calculate position relative to button
    const rect = button.getBoundingClientRect();
    popup.style.top = rect.bottom + 6 + "px";
    popup.style.left = rect.left + "px";

    // Toggle visibility
    popup.style.display = popup.style.display === "block" ? "none" : "block";
  });

  // Hide when clicking outside
  document.addEventListener("click", (e) => {
    if (!popup.contains(e.target) && !button.contains(e.target)) {
      popup.style.display = "none";
    }
  });

  // Handle Clear button
  popup.querySelector("#clearAllTables").addEventListener("click", async () => {
    if (!confirm("🧹 Clear all tables and Firestore orders?")) return;

    try {
      // Pause Firestore sync
      if (window.unsubscribeFirestore) {
        window.unsubscribeFirestore();
        console.log("🔇 Firestore listener paused");
      }

      // Local clear
      window.tableOrders = {};
      localStorage.removeItem("tableOrders");
      if (typeof onClearAll === "function") onClearAll();

      // Firebase clear
      if (window.db) {
        const { collection, getDocs, deleteDoc, doc } =
          await import("https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js");
        const snapshot = await getDocs(collection(window.db, "orders"));
        for (const d of snapshot.docs) {
          await deleteDoc(doc(window.db, "orders", d.id));
        }
        console.log("🧹 Firestore orders cleared");
      }

      // Resume Firestore listener
      setTimeout(() => {
        if (window.listenForRealtimeUpdates)
          window.listenForRealtimeUpdates();
        console.log("🔊 Firestore listener resumed");
      }, 2000);

      alert("✅ All tables cleared (local + online)");
      popup.style.display = "none";
      if (typeof renderTables === "function") renderTables();
    } catch (err) {
      console.error("❌ Error clearing tables:", err);
    }
  });
}

window.initHamburgerMenu = initHamburgerMenu;
