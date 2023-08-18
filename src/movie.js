window.addEventListener('load', function() {
  displayMovieDetails();
})


function displayMovieDetails() {
  const apiKey = '29c39e24';

  const imdbId = new URLSearchParams(window.location.search).get('imdbId');
  const url = `https://www.omdbapi.com/?apikey=${apiKey}&i=${imdbId}`;

  // Fetch data from the movies api
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const movieDetailsTemplate = document.getElementById('movie-template');
      const movieDetailsDiv = document.getElementById('movie-container');

      // Clone the template and make it visible
      const movieDetails = movieDetailsTemplate.cloneNode(true);
      movieDetails.style.display = 'flex';

      // Update the movie title, poster, and description
      movieDetails.querySelector('.title').textContent = data.Title;
      movieDetails.querySelector('.poster-img').src = data.Poster;
      movieDetails.querySelector('.movie-length').innerHTML = `<h5>Movie Length: </h5> ${data.Runtime}`;
      movieDetails.querySelector('.description').innerHTML = `<h5>Description/Plot: </h5> ${data.Plot}`;
      movieDetails.querySelector('.year').textContent = data.Year;
      movieDetails.querySelector('.rating').textContent = data.imdbRating;
      movieDetails.querySelector('.cast').textContent = data.Actors;
      movieDetails.querySelector('.votes').textContent = data.imdbVotes;

      // Update the movie details template
      const addToFavoriteBtn = movieDetails.querySelector('.favourite-btn');

      addToFavoriteBtn.addEventListener('click', function() {
        addToFavorites(data);
      });

      // Update the movie ratings
      const ratingsDiv = movieDetails.querySelector('.ratings');
      const ratingContainer = document.createElement('div');
      ratingContainer.classList.add('rating-container'); 
      data.Ratings.forEach(rating => {
        const source = document.createElement('p');
        source.textContent = rating.Source;

        const value = document.createElement('p');
        value.textContent = rating.Value;


        const ratingDiv = document.createElement('div');
        ratingDiv.classList.add('rating');
        ratingDiv.appendChild(source);
        ratingDiv.appendChild(value);

        ratingContainer.appendChild(ratingDiv);
      });
      ratingsDiv.appendChild(ratingContainer);

      // Append the updated template to the movie container
      movieDetailsDiv.appendChild(movieDetails);
    })
    .catch(error => console.log(error));
}

// Add movie to Favorites List
function addToFavorites(movieData) {
  let favourites = JSON.parse(localStorage.getItem('favourites')) || [];
  console.log("in movie", movieData)
  favourites.push(movieData);
  localStorage.setItem('favourites', JSON.stringify(favourites));
}

