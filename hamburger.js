// IMPORTANT: This function initializes the hamburger menu and must be loaded first.

/**
 * Initializes the hamburger menu functionality.
 * @param {HTMLElement} button The button element that toggles the menu.
 * @param {function} callback The function to execute when the 'Clear all items' button is clicked.
 */
function initHamburgerMenu(button, callback) {
    // Create the main menu container
    const menu = document.createElement('div');
    menu.className = 'hamburger-menu';
    // Set initial fixed positioning and hidden state
    menu.style.position = 'fixed';
    menu.style.top = '0';
    menu.style.left = '0';
    menu.style.height = '100%';
    menu.style.width = '0'; // Hidden state
    menu.style.background = '#fff';
    menu.style.boxShadow = '2px 0 6px rgba(0,0,0,0.1)';
    menu.style.overflow = 'hidden';
    menu.style.transition = 'width 0.25s ease';
    menu.style.zIndex = '1000';
    document.body.appendChild(menu);

    let isOpen = false;

    // Helper functions for menu state
    function openMenu(){ menu.style.width='50%'; isOpen=true; }
    function closeMenu(){ menu.style.width='0'; isOpen=false; }

    // Toggle logic for the hamburger button
    button.addEventListener('click', e=>{
        e.stopPropagation();
        isOpen ? closeMenu() : openMenu();
    });

    // Close menu when clicking outside
    document.addEventListener('click', ()=>{ if(isOpen) closeMenu(); });
    // Prevent menu from closing when clicking inside
    menu.addEventListener('click', e=>e.stopPropagation());

    // --- Menu Item 1: Static Label (Quỳnh Anh) with Arrow ---
    const labelItem = document.createElement('div');
    // Using HTML to include the name and the down arrow (▼)
    labelItem.innerHTML = 'Quỳnh Anh <span class="dropdown-arrow">&#x25BC;</span>'; 
    labelItem.className = 'menu-label-top'; 
    menu.appendChild(labelItem);

    // --- Menu Item 2: Clickable Action (Clear all items) ---
    const actionItem = document.createElement('div');
    actionItem.textContent = 'Clear all items';
    actionItem.addEventListener('click', ()=>{ 
        if(callback) callback(); 
        closeMenu(); 
    });
    menu.appendChild(actionItem);
}
