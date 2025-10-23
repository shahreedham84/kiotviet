function initHamburgerMenu(button) {
  if (!button) return;

  // --- Make hamburger clickable ---
  button.style.cursor = "pointer";
  button.style.userSelect = "none";
  button.style.zIndex = "9999";

  // --- Sidebar creation ---
  let sidebar = document.getElementById("sidebarMenu");
  if (!sidebar) {
    sidebar = document.createElement("div");
    sidebar.id = "sidebarMenu";
    Object.assign(sidebar.style, {
      position: "fixed",
      top: "0",
      left: "-100%",
      width: "70%",
      height: "100%",
      background: "#fff",
      boxShadow: "2px 0 12px rgba(0,0,0,0.25)",
      transition: "left 0.3s ease",
      zIndex: "2000",
      padding: "70px 20px",
      overflowY: "auto",
      borderTopRightRadius: "12px",
      borderBottomRightRadius: "12px",
    });

    // --- Menu structure ---
    sidebar.innerHTML = `
      <h2 style="margin:0 0 20px 0;padding-top:0;font-size:20px;
                 font-weight:600;color:#111;text-align:left;">
        Admin Panel
      </h2>
      <hr style="margin:10px 0 20px 0;border:0;border-top:1px solid #eee;">

      <div class="menu-btn" id="clearAllTables"
        style="display:flex;align-items:center;gap:10px;width:100%;
               padding:14px 12px;margin-bottom:12px;background:#f8f8f8;
               color:#111;border:none;border-radius:8px;font-weight:500;
               font-size:16px;text-align:left;">
        🧹 <span>Clear All Items</span>
      </div>

      <div class="menu-btn" id="invoiceHistoryBtn"
        style="display:flex;align-items:center;gap:10px;width:100%;
               padding:14px 12px;margin-bottom:10px;background:#f8f8f8;
               color:#111;border:none;border-radius:8px;font-weight:500;
               font-size:16px;text-align:left;">
        🧾 <span>Invoice History</span>
      </div>

      <div class="menu-btn" id="totalSalesBtn"
        style="display:flex;align-items:center;gap:10px;width:100%;
               padding:14px 12px;margin-bottom:10px;background:#f8f8f8;
               color:#111;border:none;border-radius:8px;font-weight:500;
               font-size:16px;text-align:left;">
        💰 <span>Total Sales Today</span>
      </div>

      <div class="menu-btn" id="settingsBtn"
        style="display:flex;align-items:center;gap:10px;width:100%;
               padding:14px 12px;margin-bottom:10px;background:#f8f8f8;
               color:#111;border:none;border-radius:8px;font-weight:500;
               font-size:16px;text-align:left;">
        ⚙️ <span>Settings</span>
      </div>

      <div style="margin-top:30px;text-align:center;color:#aaa;font-size:14px;">
        KiotViet POS v1.0
      </div>
    `;
    document.body.appendChild(sidebar);
  }

  // --- Toggle menu ---
  let isOpen = false;
  const toggleMenu = () => {
    isOpen = !isOpen;
    sidebar.style.left = isOpen ? "0" : "-100%";
  };

  button.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  document.addEventListener("click", (e) => {
    if (isOpen && !sidebar.contains(e.target) && !button.contains(e.target)) {
      toggleMenu();
    }
  });

  // --- Firebase setup + clear function ---
  import("https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js").then(({ initializeApp }) => {
    import("https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js").then(
      ({ getFirestore, collection, getDocs, deleteDoc, doc }) => {
        const firebaseConfig = {
          apiKey: "AIzaSyCkY1iwprnsEUgyFAjl0bOIUPU46R4YRjo",
          authDomain: "kiotviet-a41b1.firebaseapp.com",
          projectId: "kiotviet-a41b1",
          storageBucket: "kiotviet-a41b1.firebasestorage.app",
          messagingSenderId: "166511834957",
          appId: "1:166511834957:web:d24f894f9d26bafddca904",
        };
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);

        // --- Clear All Items ---
        const clearBtn = sidebar.querySelector("#clearAllTables");
        clearBtn.addEventListener("click", async () => {
          if (!confirm("🧹 Clear all local + Firebase orders?")) return;
          try {
            localStorage.removeItem("tableOrders");

            const snapshot = await getDocs(collection(db, "orders"));
            for (const d of snapshot.docs) await deleteDoc(doc(db, "orders", d.id));

            alert("✅ Cleared all items successfully!");
            toggleMenu();
            if (typeof renderTables === "function") renderTables();
          } catch (err) {
            console.error("❌ Error clearing orders:", err);
            alert("Failed to clear all items.");
          }
        });

        // --- Page navigation buttons ---
        sidebar.querySelector("#invoiceHistoryBtn").addEventListener("click", () => {
          window.location.href = "invoice_history.html";
        });

        sidebar.querySelector("#totalSalesBtn").addEventListener("click", () => {
          window.location.href = "total_sales.html";
        });

        sidebar.querySelector("#settingsBtn").addEventListener("click", () => {
          window.location.href = "settings.html";
        });
      }
    );
  });
}

window.initHamburgerMenu = initHamburgerMenu;
