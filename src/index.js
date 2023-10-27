// code here

// Define the base URL for the movie API

const baseUrl = 'http://localhost:3000';

// Get references to HTML elements

const poster = document.getElementById('poster');
const title = document.getElementById('title');
const runtime = document.getElementById('runtime');
const filmInfo = document.getElementById('film-info');
const showtime = document.getElementById('showtime');
const ticketNum = document.getElementById('ticket-num');
const buyTicketButton = document.getElementById('buy-ticket');
const filmList = document.getElementById('films');

// Function to update movie details on the page

function updateMovieDetails(movie) {
  poster.src = movie.poster;
  title.textContent = movie.title;
  runtime.textContent = `${movie.runtime} minutes`;
  filmInfo.textContent = movie.description;
  showtime.textContent = movie.showtime;

  // Calculate available tickets based on capacity and sold tickets

  const availableTickets = movie.capacity - movie.tickets_sold;
  ticketNum.textContent = availableTickets;

  // Disable the "Buy Ticket" button if no tickets are available

  buyTicketButton.disabled = availableTickets === 0;

  // Mark the movie as sold out

  if (availableTickets === 0) {
    buyTicketButton.textContent = 'Sold Out';

    // Add a "sold-out" class to the film item in the list

    filmList.querySelector(`li[data-film-id="${movie.id}"]`).classList.add('sold-out');
  }
}

// Function to fetch and display movie details

function fetchMovieDetails(movieId) {
  fetch(`${baseUrl}/films/${movieId}`)
    .then(response => response.json())
    .then(data => updateMovieDetails(data))
    .catch(error => console.error('Error fetching movie details:', error));
}

// Function to fetch and display the list of movies

function fetchMovieList() {
  fetch(`${baseUrl}/films`)
    .then(response => response.json())
    .then(data => {
      filmList.innerHTML = '';

      // Create a list of movies

      data.forEach(movie => {
        const filmItem = document.createElement('li');
        filmItem.className = 'film item';
        filmItem.textContent = movie.title;
        filmItem.setAttribute('data-film-id', movie.id);

        // Add a click event to load movie details

        filmItem.addEventListener('click', () => fetchMovieDetails(movie.id));
        filmList.appendChild(filmItem);
      });

      // Automatically load details of the first movie

      if (data.length > 0) {
        fetchMovieDetails(data[0].id);
      }
    })
    .catch(error => console.error('Error fetching movie list:', error));
}

// Event listener for the "Buy Ticket" button

buyTicketButton.addEventListener('click', () => {
  const availableTickets = parseInt(ticketNum.textContent, 10);
  if (availableTickets > 0) {

    // Update the number of available tickets on the page

    ticketNum.textContent = availableTickets - 1;

    // Update tickets_sold on the server

    const movieId = filmList.querySelector('.film.item.sold-out').getAttribute('data-film-id');
    fetch(`${baseUrl}/films/${movieId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tickets_sold: parseInt(ticketNum.textContent, 10) }),
    })
      .then(response => response.json())
      .then(data => {})
      .catch(error => console.error('Error updating tickets on the server:', error));
  }
});

// Initial fetch to load the list of movies and the details of the first movie

fetchMovieList();
