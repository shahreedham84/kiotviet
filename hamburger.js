function initHamburgerMenu(button) {
  if (!button) return;

  button.style.cursor = "pointer";
  button.style.userSelect = "none";
  button.style.zIndex = "3000";

  let sidebar = document.getElementById("menuSidebar");
  if (!sidebar) {
    sidebar = document.createElement("div");
    sidebar.id = "menuSidebar";
    Object.assign(sidebar.style, {
      position: "fixed",
      top: "0",
      left: "-100%",
      width: "70%",
      height: "100%",
      background: "#fff",
      boxShadow: "4px 0 16px rgba(0,0,0,0.25)",
      transition: "left 0.3s ease-in-out",
      zIndex: "2500",
      padding: "60px 20px 20px 20px", // 🟢 added top padding (60px)
      display: "none",
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "flex-start",
      overflowY: "auto",
    });

    sidebar.innerHTML = `
      <h2 style="margin:0 0 20px;font-size:22px;color:#007aff;">Menu</h2>
      <button id="adminPanelBtn"
        style="width:100%;padding:14px;margin-bottom:10px;
               background:#007aff;color:#fff;border:none;
               border-radius:8px;font-weight:bold;font-size:16px;">
        ⚙️ Admin Panel
      </button>
    `;

    document.body.appendChild(sidebar);
  }

  let isOpen = false;

  const openMenu = () => {
    sidebar.style.display = "flex";
    requestAnimationFrame(() => {
      sidebar.style.left = "0";
    });
    isOpen = true;
  };

  const closeMenu = () => {
    sidebar.style.left = "-100%";
    setTimeout(() => {
      if (!isOpen) sidebar.style.display = "none";
    }, 300);
    isOpen = false;
  };

  const toggleMenu = () => (isOpen ? closeMenu() : openMenu());

  button.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  document.addEventListener("click", (e) => {
    if (isOpen && !sidebar.contains(e.target) && !button.contains(e.target)) {
      closeMenu();
    }
  });

  sidebar.querySelector("#adminPanelBtn").addEventListener("click", () => {
    window.location.href = "admin_panel.html";
  });
}

window.initHamburgerMenu = initHamburgerMenu;
