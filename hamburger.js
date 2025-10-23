// hamburger.js
function initHamburgerMenu(button, callback) {
    const menu = document.createElement('div');
    menu.className = 'hamburger-menu';
    menu.style.position = 'fixed';
    menu.style.top = '0';
    menu.style.left = '0';
    menu.style.height = '100%';
    menu.style.width = '0';
    menu.style.background = '#fff';
    menu.style.boxShadow = '2px 0 6px rgba(0,0,0,0.1)';
    menu.style.overflow = 'hidden';
    menu.style.transition = 'width 0.25s ease';
    menu.style.zIndex = '1000';
    document.body.appendChild(menu);

    let isOpen = false;

    function openMenu() { menu.style.width = '50%'; isOpen = true; }
    function closeMenu() { menu.style.width = '0'; isOpen = false; }

    button.addEventListener('click', e => {
        e.stopPropagation();
        isOpen ? closeMenu() : openMenu();
    });

    document.addEventListener('click', () => { if (isOpen) closeMenu(); });
    menu.addEventListener('click', e => e.stopPropagation());

    // --- Menu Header (staff name) ---
    const labelItem = document.createElement('div');
    labelItem.innerHTML = 'Quỳnh Anh <span class="dropdown-arrow">&#x25BC;</span>';
    labelItem.className = 'menu-label-top';
    menu.appendChild(labelItem);

    // --- Menu Action: Clear all items ---
    const actionItem = document.createElement('div');
    actionItem.textContent = 'Clear all items';
    actionItem.style.cursor = 'pointer';
    actionItem.style.padding = '12px';
    actionItem.style.fontWeight = '500';
    actionItem.style.borderTop = '1px solid #eee';
    actionItem.addEventListener('click', () => {
        if (typeof callback === 'function') callback();

        // ✅ Clear localStorage + memory completely
        localStorage.removeItem('tableOrders');
        window.tableOrders = {};
        console.log("✅ All tables cleared.");

        // ✅ Re-render UI
        if (typeof renderTables === 'function') {
            renderTables(document.querySelector('.tabs button.active')?.dataset.filter || 'all');
        }

        // Optional visual confirmation
        const toast = document.createElement('div');
        toast.textContent = '✅ All items cleared';
        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%)';
        toast.style.background = '#007aff';
        toast.style.color = '#fff';
        toast.style.padding = '10px 20px';
        toast.style.borderRadius = '8px';
        toast.style.fontWeight = '500';
        toast.style.zIndex = '2000';
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2000);

        closeMenu();
    });
    menu.appendChild(actionItem);
}
