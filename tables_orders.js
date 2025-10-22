window.tableOrders = JSON.parse(localStorage.getItem('tableOrders') || '{}');
window.activeTable = null;
// NOTE: window.products must be defined elsewhere in your application.

function saveOrders() { localStorage.setItem('tableOrders', JSON.stringify(window.tableOrders)); }

function initTablesOrders() {
  renderTables('all');

  document.querySelectorAll('.tabs button').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tabs button').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderTables(tab.dataset.filter);
    });
  });

  initOrderScreen();
  initSearch();
  initFooterButtons();
}

function renderTables(filter = 'all') {
  const tableGrid = document.getElementById('tableGrid');
  tableGrid.innerHTML = '';
  for (let i = 1; i <= 12; i++) {
    const id = 'Table ' + i;
    const inUse = window.tableOrders[id]?.length > 0;
    if (filter === 'inuse' && !inUse) continue;
    if (filter === 'available' && inUse) continue;

    const tile = document.createElement('div');
    tile.className = 'tile' + (inUse ? ' in-use' : '');
    tile.textContent = id;
    tile.addEventListener('click', () => openTable(id));
    tableGrid.appendChild(tile);
  }
}

function openTable(id) {
  window.activeTable = id;
  document.getElementById('currentTable').textContent = id;
  document.getElementById('mainScreen').style.display = 'none';
  document.getElementById('orderScreen').style.display = 'flex';
  renderOrderList();
}

document.getElementById('closeOrder').addEventListener('click', () => {
  document.getElementById('orderScreen').style.display = 'none';
  document.getElementById('mainScreen').style.display = 'block';
  const activeTab = document.querySelector('.tabs button.active');
  renderTables(activeTab ? activeTab.dataset.filter : 'all');
});

function renderOrderList() {
  const orderList = document.getElementById('orderList');
  const totalAmount = document.getElementById('totalAmount');
  orderList.innerHTML = '';
  let total = 0;
  const items = window.tableOrders[window.activeTable] || [];
  if (!items.length) { totalAmount.textContent = '0'; orderList.innerHTML = '<div style="text-align:center;color:#999;padding:20px 0;">No items added.</div>'; return; }
  items.forEach((item, idx) => {
    total += item.price * item.qty;
    const row = document.createElement('div');
    row.className = 'order-item';
    row.innerHTML = `
      <div class="order-name">${item.name}</div>
      <div class="order-controls">
        <button class="minus">−</button>
        <span class="qty">${item.qty}</span>
        <button class="plus">+</button>
        <button class="del">✕</button>
      </div>
    `;
    row.querySelector('.minus').addEventListener('click', () => {
      if (item.qty > 1) item.qty--; else items.splice(idx, 1);
      saveOrders(); renderOrderList(); renderTables(document.querySelector('.tabs button.active').dataset.filter);
    });
    row.querySelector('.plus').addEventListener('click', () => {
      item.qty++; saveOrders(); renderOrderList();
    });
    row.querySelector('.del').addEventListener('click', () => {
      items.splice(idx, 1); saveOrders(); renderOrderList(); renderTables(document.querySelector('.tabs button.active').dataset.filter);
    });
    orderList.appendChild(row);
  });
  totalAmount.textContent = total.toLocaleString();
}

function initSearch() {
  const searchBox = document.querySelector('.searchbox');
  const resultsDiv = document.getElementById('searchResults');
  searchBox.addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    resultsDiv.innerHTML = '';
    if (!q.trim()) return;
    const products = window.products || [];
    const results = products.filter(p => p.name.toLowerCase().includes(q));
    results.forEach(p => {
      const div = document.createElement('div');
      div.className = 'search-item';
      div.textContent = `${p.name} - ${p.price.toLocaleString()}đ`;
      div.addEventListener('click', () => {
        if (!window.tableOrders[window.activeTable]) window.tableOrders[window.activeTable] = [];
        const existing = window.tableOrders[window.activeTable].find(i => i.name === p.name);
        if (existing) existing.qty++; else window.tableOrders[window.activeTable].push({ ...p, qty: 1 });
        saveOrders(); renderOrderList(); searchBox.value = ''; resultsDiv.innerHTML = '';
        renderTables(document.querySelector('.tabs button.active').dataset.filter);
      });
      resultsDiv.appendChild(div);
    });
  });
}

function initOrderScreen() { /* kept for structure */ }

function initFooterButtons() {
  const footer = document.getElementById('footerButtons');
  footer.innerHTML = `
    <button class="draft">Draft</button>
    <button class="notify">Notify</button>
    <button class="checkout">Checkout</button>
  `;
  
  // DRAFT Button (Simple Alert)
  footer.querySelector('.draft').addEventListener('click', () => alert('Draft clicked!'));

  // NOTIFY Button (Opens kot.html)
  footer.querySelector('.notify').addEventListener('click', () => {
    if (!window.activeTable || !window.tableOrders[window.activeTable] || window.tableOrders[window.activeTable].length === 0) {
      alert('Cannot notify kitchen. Table is empty.');
      return;
    }

    const currentItems = window.tableOrders[window.activeTable];
    
    // Format KOT data
    const kotData = {
      table: window.activeTable,
      server: "Quỳnh Anh", 
      items: currentItems.map(item => ({
        name: item.name,
        unit: '', // DVT set to blank
        qty: item.qty
      }))
    };
    
    const kotWindow = window.open('kot.html', '_blank', 'width=350,height=600'); 

    if (kotWindow) {
        setTimeout(() => {
            try {
                const bc = new BroadcastChannel('kot_channel');
                bc.postMessage({ type: "ORDER_DATA", data: kotData });
                bc.close();
            } catch (e) {
                if (kotWindow.receiveKOTData) {
                   kotWindow.receiveKOTData(JSON.stringify(kotData));
                } else {
                    console.error('KOT page failed to receive data.');
                }
            }
        }, 500);
    }
  });

  // CHECKOUT Button (Opens invoice.html)
  footer.querySelector('.checkout').addEventListener('click', () => {
    if (!window.activeTable || !window.tableOrders[window.activeTable] || window.tableOrders[window.activeTable].length === 0) {
      alert('Cannot checkout. Table is empty.');
      return;
    }

    const currentItems = window.tableOrders[window.activeTable];
    
    // 1. Format data for invoice.html (name, price, qty are required)
    const invoiceData = {
      table: window.activeTable,
      // Generate a temporary Bill No.
      billNo: `INV${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 100)}`, 
      discount: 0, // Default discount to 0
      items: currentItems.map(item => ({
        name: item.name,
        price: item.price,
        qty: item.qty
      }))
    };

    // 2. Save data to localStorage so invoice.html can access it immediately
    localStorage.setItem("papadumsInvoiceData", JSON.stringify(invoiceData));

    // 3. Open invoice.html in a new window/tab (58mm width for invoice)
    window.open('invoice.html', '_blank', 'width=300,height=800');
  });
}

