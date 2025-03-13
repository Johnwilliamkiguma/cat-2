const movieContainer = document.getElementById("movie-container");
const searchBar = document.getElementById("search-bar");
const genreButtons = document.querySelectorAll(".genre-btn");

async function searchMovies(query) {
    const url = `https://api.tvmaze.com/search/shows?q=${query}`;
    const response = await fetch(url);
    const data = await response.json();
    displayMovies(data.map(item => item.show));
}

async function getMoviesByGenre(genre) {
    const url = `https://api.tvmaze.com/search/shows?q=${genre}`;
    const response = await fetch(url);
    const data = await response.json();
    displayMovies(data.map(item => item.show));
}

function displayMovies(movies) {
    movieContainer.innerHTML = "";
    movies.forEach(movie => {
        if (movie.image && movie.image.medium) {
            const movieCard = document.createElement("div");
            movieCard.classList.add("movie-card");

            movieCard.innerHTML = `
                <img src="${movie.image.medium}" alt="${movie.name}">
                <h3>${movie.name}</h3>
                <span class="rating">${movie.rating.average ? movie.rating.average.toFixed(1) : "N/A"}</span>
            `;

            movieContainer.appendChild(movieCard);
        }
    });
}

searchBar.addEventListener("input", () => {
    const query = searchBar.value;
    if (query.length > 2) {
        searchMovies(query);
    } else {
        movieContainer.innerHTML = "";
    }
});

genreButtons.forEach(button => {
    button.addEventListener("click", () => {
        getMoviesByGenre(button.dataset.genre);
    });
});
