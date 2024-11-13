document.addEventListener('DOMContentLoaded', () => {
    const theaterSelect = document.getElementById('theater-select');
    const searchInput = document.getElementById('search-input');
    const moviesContainer = document.getElementById('movies-container');
  
    function fetchTheaters() {
      fetch('http://www.finnkino.fi/xml/TheatreAreas/')
        .then(response => response.text())
        .then(data => {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(data, 'text/xml');
          const theaters = xmlDoc.getElementsByTagName('TheatreArea');
  
          Array.from(theaters).forEach(theater => {
            const option = document.createElement('option');
            option.value = theater.getElementsByTagName('ID')[0].textContent;
            option.textContent = theater.getElementsByTagName('Name')[0].textContent;
            theaterSelect.appendChild(option);
          });
        })
        .catch(error => console.error('Error fetching theaters:', error));
    }
  
    function fetchMovies(theaterId) {
      fetch(`http://www.finnkino.fi/xml/Schedule/?area=${theaterId}`)
        .then(response => response.text())
        .then(data => {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(data, 'text/xml');
          const shows = xmlDoc.getElementsByTagName('Show');
  
          moviesContainer.innerHTML = '';
  
          Array.from(shows).forEach(show => {
            const movieTitle = show.getElementsByTagName('Title')[0].textContent;
            const posterUrl = show.getElementsByTagName('EventLargeImagePortrait')[0].textContent;
            const showTimes = show.getElementsByTagName('dttmShowStart')[0].textContent;
  
            const movieCard = document.createElement('div');
            movieCard.classList.add('movie-card');
  
            movieCard.innerHTML = `
              <img src="${posterUrl}" alt="${movieTitle}">
              <h3>${movieTitle}</h3>
              <p>Showtime: ${new Date(showTimes).toLocaleTimeString()}</p>
            `;
  
            moviesContainer.appendChild(movieCard);
          });
        })
        .catch(error => console.error('Error fetching movies:', error));
    }
  
    theaterSelect.addEventListener('change', () => {
      const selectedTheater = theaterSelect.value;
      if (selectedTheater) fetchMovies(selectedTheater);
    });
  
    fetchTheaters();
  });
  