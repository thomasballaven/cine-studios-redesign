document.addEventListener('DOMContentLoaded', () => {
  let cart = [];

  // --- 1. OUVERTURE DU PANNEAU SOUS L'HEURE ---
  const timePills = document.querySelectorAll('.time-pill');
  timePills.forEach(pill => {
    pill.addEventListener('click', function() {
      const container = this.closest('.times-grid');
      container.querySelectorAll('.time-pill').forEach(p => {
        p.style.borderColor = "transparent";
        p.style.backgroundColor = "var(--bg-surface-light)";
      });
      
      this.style.borderColor = "var(--primary)";
      this.style.backgroundColor = "var(--bg-dark)";

      const infoSection = this.closest('.schedule-info, .film-detail-container > div');
      const panel = infoSection.querySelector('.booking-panel');
      const timeDisplay = panel.querySelector('.selected-time-display');
      
      timeDisplay.textContent = this.textContent;
      panel.dataset.movie = infoSection.querySelector('h1, h3').textContent;
      panel.classList.add('active');
    });
  });

  // --- 2. BOUTONS + / - DES BILLETS ---
  document.querySelectorAll('.counter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const isPlus = this.classList.contains('plus');
      const row = this.closest('.ticket-card');
      const qtySpan = row.querySelector('.qty');
      let currentQty = parseInt(qtySpan.textContent);
      
      if (isPlus) currentQty++;
      else if (!isPlus && currentQty > 0) currentQty--;
      
      qtySpan.textContent = currentQty;
      updatePanelTotal(this.closest('.booking-panel'));
    });
  });

  function updatePanelTotal(panel) {
    let total = 0;
    panel.querySelectorAll('.ticket-card').forEach(card => {
      const qty = parseInt(card.querySelector('.qty').textContent);
      const price = parseFloat(card.querySelector('.plus').dataset.price);
      total += qty * price;
    });
    
    const addBtn = panel.querySelector('.btn-add-cart');
    addBtn.textContent = total > 0 ? `Ajouter au panier - ${total.toFixed(2)}€` : 'Sélectionnez vos places';
    addBtn.className = total > 0 ? 'btn btn-primary btn-add-cart' : 'btn btn-outline btn-add-cart';
    addBtn.disabled = total === 0;
  }

  // --- 3. AJOUTER AU PANIER ---
  document.querySelectorAll('.btn-add-cart').forEach(btn => {
    btn.addEventListener('click', function() {
      if(this.disabled) return;
      
      const panel = this.closest('.booking-panel');
      const movie = panel.dataset.movie;
      const time = panel.querySelector('.selected-time-display').textContent;
      
      panel.querySelectorAll('.ticket-card').forEach(card => {
        const qty = parseInt(card.querySelector('.qty').textContent);
        if(qty > 0) {
          const type = card.querySelector('h4').textContent;
          const price = parseFloat(card.querySelector('.plus').dataset.price);
          cart.push({ movie, time, type, price, qty });
          card.querySelector('.qty').textContent = '0'; // reset
        }
      });

      updatePanelTotal(panel);
      panel.classList.remove('active');
      renderCart();
      toggleCart(true);
    });
  });

  // --- 4. GESTION DU PANIER (UI) ---
  const cartSidebar = document.getElementById('cartSidebar');
  const cartOverlay = document.getElementById('cartOverlay');

  function toggleCart(show) {
    if(show) {
      cartSidebar.classList.add('active');
      cartOverlay.classList.add('active');
    } else {
      cartSidebar.classList.remove('active');
      cartOverlay.classList.remove('active');
    }
  }

  document.getElementById('floatingCartBtn')?.addEventListener('click', () => toggleCart(true));
  document.getElementById('closeCart')?.addEventListener('click', () => toggleCart(false));
  cartOverlay?.addEventListener('click', () => toggleCart(false));

  function renderCart() {
    const cartBody = document.getElementById('cartBody');
    const cartTotalEl = document.getElementById('cartTotal');
    const badge = document.getElementById('cartBadge');
    
    cartBody.innerHTML = '';
    let total = 0;
    let count = 0;

    if(cart.length === 0) {
      cartBody.innerHTML = '<p style="color:var(--text-muted); text-align:center; margin-top:2rem;">Votre panier est vide.</p>';
    } else {
      cart.forEach((item, index) => {
        total += item.price * item.qty;
        count += item.qty;
        cartBody.innerHTML += `
          <div class="cart-item">
            <h4 style="margin-bottom:0.5rem">${item.movie}</h4>
            <p style="color:var(--primary); font-size:0.9rem;">Séance : ${item.time}</p>
            <div style="display:flex; justify-content:space-between; margin-top:1rem; color:var(--text-muted);">
              <span>${item.qty}x ${item.type}</span>
              <span style="color:white; font-weight:bold;">${(item.price * item.qty).toFixed(2)}€</span>
            </div>
          </div>
        `;
      });
    }

    cartTotalEl.textContent = total.toFixed(2) + '€';
    if(badge) badge.textContent = count;
  }
});
