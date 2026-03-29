document.addEventListener('DOMContentLoaded', () => {
  // Mock booking selection
  const timePills = document.querySelectorAll('.time-pill');
  timePills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      const time = e.target.innerText;
      const movie = e.target.closest('.schedule-row')?.querySelector('h3')?.innerText || 'Le Film';
      
      // Store in localStorage for a cart/checkout flow
      localStorage.setItem('selectedMovie', movie);
      localStorage.setItem('selectedTime', time);
      
      alert(`Vous avez sélectionné : ${movie} à ${time}.\nRedirection vers le paiement...`);
    });
  });

  // Date filters UI update
  const dateBtns = document.querySelectorAll('.date-btn');
  dateBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      dateBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      // In a real app, this would fetch new showtimes via AJAX
    });
  });
});
