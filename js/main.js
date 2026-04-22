// --- EFFET NAVBAR AU SCROLL ---
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (window.scrollY > 50) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

// --- VARIABLES GLOBALES RESERVATION ---
const TICKET_PRICE = 9.50; // Prix fixe premium
let selectedSeats = [];

// --- ELEMENTS DOM ---
const modal = document.getElementById('bookingModal');
const seatMap = document.getElementById('seatMap');
const confirmBtn = document.getElementById('confirmBtn');
const seatCountEl = document.getElementById('seatCount');
const seatNumbersEl = document.getElementById('seatNumbers');
const totalPriceEl = document.getElementById('totalPrice');

// --- OUVERTURE DE LA MODALE ---
function openBooking(title, time, imgSrc) {
  // Reset de l'état précédent
  selectedSeats = [];
  updateSummary();
  
  // Remplissage des données du film
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalImg').src = imgSrc;
  
  // Générer la salle de cinéma
  generateSeatMap();
  
  // Afficher Modale
  modal.classList.add('active');
  document.body.style.overflow = 'hidden'; // Empêche le scroll du body
}

// --- FERMETURE DE LA MODALE ---
function closeBooking() {
  modal.classList.remove('active');
  document.body.style.overflow = 'auto';
}

// --- GENERATION GRILLE DE SIEGES ---
function generateSeatMap() {
  seatMap.innerHTML = ''; // Clear ancien map
  const totalSeats = 48; (6 rangées x 8 colonnes)
  
  for (let i = 1; i <= totalSeats; i++) {
    const seat = document.createElement('div');
    seat.classList.add('seat');
    
    // Définir un identifiant de siège (ex: A1, B3)
    const row = String.fromCharCode(65 + Math.floor((i - 1) / 8)); // A, B, C...
    const col = ((i - 1) % 8) + 1;
    seat.dataset.id = `${row}${col}`;

    // Simuler des sièges déjà occupés (30% de chance)
    if (Math.random() < 0.3) {
      seat.classList.add('occupied');
    } else {
      // Event listener pour sièges libres
      seat.addEventListener('click', () => toggleSeat(seat));
    }
    
    seatMap.appendChild(seat);
  }
}

// --- SELECTION D'UN SIEGE ---
function toggleSeat(seatElement) {
  const seatId = seatElement.dataset.id;

  if (seatElement.classList.contains('selected')) {
    // Désélectionner
    seatElement.classList.remove('selected');
    selectedSeats = selectedSeats.filter(id => id !== seatId);
  } else {
    // Sélectionner (Limité à 8 places max)
    if (selectedSeats.length >= 8) {
      alert("Vous ne pouvez réserver que 8 places maximum par transaction.");
      return;
    }
    seatElement.classList.add('selected');
    selectedSeats.push(seatId);
  }

  updateSummary();
}

// --- MISE A JOUR DU RESUME ET BOUTON ---
function updateSummary() {
  const count = selectedSeats.length;
  seatCountEl.textContent = count;
  
  if (count === 0) {
    seatNumbersEl.textContent = '-';
    totalPriceEl.textContent = '0.00 €';
    confirmBtn.disabled = true;
    confirmBtn.textContent = 'Sélectionnez vos sièges';
  } else {
    // Trier les sièges alphabétiquement
    seatNumbersEl.textContent = selectedSeats.sort().join(', ');
    const total = (count * TICKET_PRICE).toFixed(2);
    totalPriceEl.textContent = `${total} €`;
    confirmBtn.disabled = false;
    confirmBtn.textContent = `Confirmer et payer ${total} €`;
  }
}

// --- SELECTION HORAIRES ---
document.querySelectorAll('.time-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
  });
});

// --- VALIDATION ET TOAST FEEDBACK ---
confirmBtn.addEventListener('click', () => {
  const title = document.getElementById('modalTitle').textContent;
  const time = document.querySelector('.time-btn.active').textContent;
  
  // Sauvegarde fictive LocalStorage
  const bookingData = { film: title, time: time, seats: selectedSeats, total: selectedSeats.length * TICKET_PRICE };
  localStorage.setItem('lastBooking', JSON.stringify(bookingData));

  closeBooking();
  
  // Afficher Toast de succès
  const toast = document.getElementById('toast');
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
});
