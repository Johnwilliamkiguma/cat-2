const API_KEY = "api_key=ec332d19e6fed067df0160ce34067cc4";
const BASE_URL = "https://api.themoviedb.org/3";
const API_URL = `${BASE_URL}/discover/movie?sort_by=popularity.desc&${API_KEY}`;
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";
const SEARCH_URL = `${BASE_URL}/search/movie?${API_KEY}&query=`;

const genres = [
    { id: 28, name: "Action" }, { id: 12, name: "Adventure" }, { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" }, { id: 80, name: "Crime" }, { id: 99, name: "Documentary" },
    { id: 18, name: "Drama" }, { id: 10751, name: "Family" }, { id: 14, name: "Fantasy" },
    { id: 36, name: "History" }, { id: 27, name: "Horror" }, { id: 10402, name: "Music" },
    { id: 9648, name: "Mystery" }, { id: 10749, name: "Romance" }, { id: 878, name: "Sci-Fi" },
    { id: 53, name: "Thriller" }, { id: 10752, name: "War" }, { id: 37, name: "Western" }
];

// Get DOM elements safely
const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");
const tagsEl = document.getElementById("tags");
const prev = document.getElementById("prev");
const next = document.getElementById("next");
const current = document.getElementById("current");

// Check if elements exist to avoid errors
if (!main || !form || !search || !tagsEl || !prev || !next || !current) {
    console.error("One or more elements are missing from the DOM.");
}

let currentPage = 1;
let totalPages = 100;
let selectedGenre = [];

setGenre();
getMovies(API_URL);

// Function to create genre tags
function setGenre() {
    if (!tagsEl) return; // Prevent errors if element is missing
    tagsEl.innerHTML = "";

    genres.forEach((genre) => {
        const t = document.createElement("div");
        t.classList.add("tag");
        t.id = genre.id;
        t.innerText = genre.name;
        t.addEventListener("click", () => {
            if (selectedGenre.includes(genre.id)) {
                selectedGenre = selectedGenre.filter((id) => id !== genre.id);
            } else {
                selectedGenre.push(genre.id);
            }
            getMovies(`${API_URL}&with_genres=${selectedGenre.join(",")}`);
            highlightSelection();
        });
        tagsEl.appendChild(t);
    });
}

// Function to highlight selected genres
function highlightSelection() {
    document.querySelectorAll(".tag").forEach(tag => {
        tag.classList.remove("highlight");
        if (selectedGenre.includes(parseInt(tag.id))) {
            tag.classList.add("highlight");
        }
    });
}

// Fetch movies from API
function getMovies(url) {
    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            if (data.results && data.results.length > 0) {
                showMovies(data.results);
                currentPage = data.page;
                totalPages = data.total_pages;
                if (current) current.innerText = currentPage;
            } else {
                if (main) main.innerHTML = `<h1>No Results Found</h1>`;
            }
        })
        .catch(error => {
            console.error("Error fetching movies:", error);
            if (main) main.innerHTML = `<h1>Error fetching data. Try again later.</h1>`;
        });
}

// Display movies on the page
function showMovies(data) {
    if (!main) return;
    main.innerHTML = "";

    data.forEach((movie) => {
        const { title, poster_path, vote_average, overview } = movie;
        const movieEl = document.createElement("div");
        movieEl.classList.add("movie");
        movieEl.innerHTML = `
            <img src="${poster_path ? IMAGE_URL + poster_path : "https://via.placeholder.com/200"}" alt="${title}">
            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getColor(vote_average)}">${vote_average.toFixed(1)}</span>
            </div>
            <div class="overview">
                <h3>Overview</h3>
                <p>${overview || "No overview available."}</p>
            </div>
        `;
        main.appendChild(movieEl);
    });
}

// Get color based on rating
function getColor(vote) {
    return vote >= 8 ? "green" : vote >= 5 ? "orange" : "red";
}

// Search movie
if (form) {
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const searchTerm = search.value.trim();
        if (searchTerm) {
            getMovies(SEARCH_URL + encodeURIComponent(searchTerm));
        }
    });
}

// Pagination - Previous Page
if (prev) {
    prev.addEventListener("click", () => {
        if (currentPage > 1) {
            getMovies(`${API_URL}&page=${currentPage - 1}`);
        }
    });
}

// Pagination - Next Page
if (next) {
    next.addEventListener("click", () => {
        if (currentPage < totalPages) {
            getMovies(`${API_URL}&page=${currentPage + 1}`);
        }
    });
}