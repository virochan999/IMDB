document.addEventListener('DOMContentLoaded', function() {
  displayFavoriteMovies();
});

// Display Favourite movies list functionality
function displayFavoriteMovies() {
  const favoritesList = document.getElementById('favourites-list');
  const favourites = JSON.parse(localStorage.getItem('favourites')) || [];

  favoritesList.innerHTML = ''; // Clear the previous content

  favourites.forEach(movie => {
    const movieDiv = document.createElement('div');
    movieDiv.classList.add('favourite-movie');

    const title = document.createElement('h2');
    title.textContent = movie.Title;
    movieDiv.appendChild(title);

    // Create "Remove from Favorites" button
    const removeBtn = document.createElement('button');
    removeBtn.classList.add('remove-btn')

    removeBtn.textContent = 'Remove from Favorites';
    removeBtn.addEventListener('click', function() {
      removeFromFavorites(movie);
      displayFavoriteMovies(); // Refresh the list after removal
    });
    movieDiv.appendChild(removeBtn);

    favoritesList.appendChild(movieDiv);
  });
}

// Remove the movie from localstorage
function removeFromFavorites(movie) {
  let favourites = JSON.parse(localStorage.getItem('favourites')) || [];
  favourites = favourites.filter(favorite => favorite.imdbID !== movie.imdbID);
  localStorage.setItem('favourites', JSON.stringify(favourites));
}

