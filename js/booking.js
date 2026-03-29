document.addEventListener('DOMContentLoaded', () => {
  /* =========================================
     1. SHOWTIME SELECTION
     ========================================= */
  const timePills = document.querySelectorAll('.time-pill');

  timePills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      const time = e.target.innerText;

      const movie =
        e.target.closest('.schedule-row')
          ?.querySelector('h3')
          ?.innerText || 'Le Film';

      // Save booking selection
      localStorage.setItem('selectedMovie', movie);
      localStorage.setItem('selectedTime', time);

      // Redirect directly to booking page
      window.location.href = "booking.html";
    });
  });

  /* =========================================
     2. DATE FILTER UI
     ========================================= */
  const dateBtns = document.querySelectorAll('.date-btn');

  dateBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      dateBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Future improvement:
      // fetch new showtimes dynamically
    });
  });

  /* =========================================
     3. DISPLAY BOOKING ON booking.html
     ========================================= */
  const movieName = document.getElementById('movie-name');
  const movieTime = document.getElementById('movie-time');

  if (movieName && movieTime) {
    const movie = localStorage.getItem('selectedMovie');
    const time = localStorage.getItem('selectedTime');

    movieName.textContent = movie || 'Aucun film sélectionné';
    movieTime.textContent = time || 'Aucune séance sélectionnée';
  }
});

/* =========================================
   4. CLEAR BOOKING
   ========================================= */
function clearBooking() {
  localStorage.removeItem('selectedMovie');
  localStorage.removeItem('selectedTime');

  // Reload booking page
  location.reload();
}
