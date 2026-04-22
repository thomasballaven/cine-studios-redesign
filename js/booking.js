document.addEventListener('DOMContentLoaded', () => {
  // 1. Gérer les clics sur les heures (Sélection de séance)
  const timePills = document.querySelectorAll('.time-pill');
  
  timePills.forEach(pill => {
    pill.addEventListener('click', function() {
      // Retirer la classe active de tous les boutons de cette ligne
      const container = this.closest('.times-grid');
      container.querySelectorAll('.time-pill').forEach(p => p.classList.remove('active'));
      
      // Ajouter la classe active au bouton cliqué
      this.classList.add('active');
      this.style.borderColor = "var(--primary)";
      this.style.backgroundColor = "var(--bg-dark)";

      // Trouver le panneau de réservation associé
      const scheduleInfo = this.closest('.schedule-info') || this.closest('.film-detail-container > div');
      const bookingPanel = scheduleInfo.querySelector('.booking-panel');
      const timeDisplay = bookingPanel.querySelector('.selected-time-display');
      
      // Mettre à jour l'heure affichée et ouvrir le panneau
      timeDisplay.textContent = this.textContent;
      bookingPanel.classList.add('active');
    });
  });

  // 2. Gérer le système de billets (+ et -)
  const counterBtns = document.querySelectorAll('.counter-btn');
  
  counterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const isPlus = this.classList.contains('plus');
      const row = this.closest('.ticket-row');
      const qtySpan = row.querySelector('.qty');
      const price = parseFloat(this.getAttribute('data-price'));
      
      let currentQty = parseInt(qtySpan.textContent);
      
      if (isPlus) {
        currentQty += 1;
      } else if (!isPlus && currentQty > 0) {
        currentQty -= 1;
      }
      
      qtySpan.textContent = currentQty;
      
      // Mettre à jour le prix total du panneau actuel
      updateTotal(this.closest('.booking-panel'));
    });
  });

  function updateTotal(panel) {
    let total = 0;
    const rows = panel.querySelectorAll('.ticket-row');
    
    rows.forEach(row => {
      const qty = parseInt(row.querySelector('.qty').textContent);
      const price = parseFloat(row.querySelector('.plus').getAttribute('data-price'));
      total += qty * price;
    });
    
    panel.querySelector('.total-price').textContent = total.toFixed(2) + '€';
    
    // Griser le bouton payer si total = 0
    const payBtn = panel.querySelector('.btn-pay');
    if(total > 0) {
      payBtn.classList.remove('btn-outline');
      payBtn.classList.add('btn-primary');
      payBtn.disabled = false;
    } else {
      payBtn.classList.add('btn-outline');
      payBtn.classList.remove('btn-primary');
      payBtn.disabled = true;
    }
  }

  // 3. Bouton Payer
  document.querySelectorAll('.btn-pay').forEach(btn => {
    btn.addEventListener('click', function() {
      const total = this.closest('.booking-panel').querySelector('.total-price').textContent;
      if(total === "0.00€") return;
      
      alert(`Redirection vers la page de paiement sécurisée...\nMontant à régler : ${total}`);
      // Ici, vous pourriez rediriger vers une page checkout.html
    });
  });
});
