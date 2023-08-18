const searchInput = document.querySelector('.search-input');
const listItem = document.querySelector('.list-item');
// api key
const apiKey = '29c39e24';

const url = `https://www.omdbapi.com/?apikey=${apiKey}`;

let abortController = new AbortController();

/* For storing search results */
const movieList = [];

if(!movieList.length) {
  listItem.style.display = 'none';
} else {
  listItem.style.display = 'block';
}

searchInput.addEventListener('input', () => {
  const searchInputValue = searchInput.value;
  
  if (searchInputValue.length < 3) {
    // Clear search results if search input value is less than 3 characters
    listItem.innerHTML = '';
    listItem.style.display = 'none';
    return;
  }
  
  // Cancel previous request
  abortController.abort();
  abortController = new AbortController();

  const urlWithQuery = `${url}&s=${searchInputValue}`;
  
  // Fetch movies on search
  fetch(urlWithQuery, { signal: abortController.signal })
    .then(response => response.json())
    .then(data => {
      // Clear previous search results
      listItem.innerHTML = '';

      if(data.Response === 'False') {
        const notFound = document.createElement('div');
        notFound.classList.add('not-found');
        listItem.style.padding = '0.2rem';
        notFound.innerHTML = 'Movie Not Found';
        listItem.append(notFound);
      } else {
        listItem.style.display = 'block';
      }
      
      // Add each movie to the search list
      if(data.Search) {
        data.Search.forEach(movie => {
          const item = document.createElement('div');
          item.classList.add('item');
          item.dataset.imdbId = movie.imdbID;

          // Check if the movie is already in favorites
          const isFavorite = localStorage.getItem('favourites') ? JSON.parse(localStorage.getItem('favourites')).some(fav => fav.imdbID === movie.imdbID) : false;

          // Apply a class based on whether it's in favorites or not
          const favoriteClass = isFavorite ? 'icon fa-sharp fa-solid fa-heart favourite-btn favorite' : 'icon fa-sharp fa-solid fa-heart favourite-btn';

          item.innerHTML = `<a class="movie-name"> ${movie.Title} </a> <i class="${favoriteClass}" data-favorite="${isFavorite}"></i>`;

          if (isFavorite) {
            item.classList.add('red-heart');
          }

          // item.innerHTML = `<a class="movie-name"> ${movie.Title} </a> <i class="icon fa-sharp fa-solid fa-heart favourite-btn"></i>`;
          listItem.appendChild(item);
        });
  
        // Store search results in movieList array
        movieList.push(data);

        const favouriteIcons = document.getElementsByClassName('favourite-btn');
        for (const icon of favouriteIcons) {
          icon.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            addToFavoritesFromIcon(event);
          });
        }
      }
    })
    .catch(error => {
      listItem.style.display = 'none';
      console.log(error)
    });
});

// Event to handle route to description page
listItem.addEventListener('click', (event) => {
  const item = event.target.closest('.item');
  if (item) {
    const imdbId = item.dataset.imdbId;
    // Route to movie description page with the imdbId
    const baseURL = window.location.href.split('/').slice(0, -1).join('/');
    window.location.href = `${baseURL}/pages/movie.html?imdbId=${imdbId}`;
  }
});

// Add the movie to favourites list
function addToFavoritesFromIcon(event) {
  const item = event.target.closest('.item');
  const imdbId = item.dataset.imdbId;

  const movieData = movieList
  .flatMap(movie => movie.Search) 
  .find(item => item.imdbID === imdbId); 

  let favourites = JSON.parse(localStorage.getItem('favourites')) || [];

  if(favourites) {
    if(favourites.some((movie) => movieData.imdbID === movie.imdbID)) {
      alert("Movie already exists in favorites list");
      return;
    }
  }

  favourites.push(movieData);
  localStorage.setItem('favourites', JSON.stringify(favourites));

  // Add a custom attribute to mark the heart icon
  const heartIcon = item.querySelector('.favourite-btn');
  heartIcon.setAttribute('data-favorite', 'true');
  heartIcon.classList.add('favorite');
  heartIcon.classList.add('in-favorite');

}