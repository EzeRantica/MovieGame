//Lista de JSON con los datos de las películas
const movieData = [
    {
      "movie_id": 503919,
      "title": "The Lighthouse",
      "fake_location_name": "The lighthouse island",
      "real_location_name": "Cape Forchu, Canada",
      "latitude": 43.80769184157821,
      "longitude": -66.15837230264533,
      "day": 39,
      "screenshot": "/blank_screenshot.jpg"
    },
    {
      "movie_id": 475557,
      "title": "Joker",
      "fake_location_name": "The dance stairs",
      "real_location_name": "1161 Shakespeare Ave, Bronx, New York, United States",
      "latitude": 40.83596110796703,
      "longitude": -73.92408623612766,
      "day": 40,
      "screenshot": "/blank_screenshot.jpg"
    },
    {
      "movie_id": 103,
      "title": "Taxi Driver",
      "fake_location_name": "The adult theater",
      "real_location_name": "Lyric Theatre, W 43td St., New York, United States",
      "latitude": 40.75722470582079,
      "longitude": -73.98766139384003,
      "day": 41,
      "screenshot": "/blank_screenshot.jpg"
    },
    {
      "movie_id": 153,
      "title": "Lost in translation",
      "fake_location_name": "The tokyo hotel",
      "real_location_name": "Park Hyatt Tokyo, Tokyo, Japan",
      "latitude": 35.68560099499451,
      "longitude": 139.69073151839314,
      "day": 42,
      "screenshot": "/blank_screenshot.jpg"
    },
    {
      "movie_id": 25376,
      "title": "El Secreto de sus Ojos",
      "fake_location_name": "The Racing Club Stadium",
      "real_location_name": "Cancha de Racing",
      "latitude": -34.668279246340816,
      "longitude": -58.3688647400434,
      "day": 43,
      "screenshot": "/blank_screenshot.jpg"
    },
    {
      "movie_id": 324552,
      "title": "John Wick 2",
      "fake_location_name": "The Continental Hotel",
      "real_location_name": "The Beaver Building at 1 Wall Street Court in New York City",
      "latitude": 40.70539427010482,
      "longitude": -74.0082465033104,
      "day": 44,
      "screenshot": "/blank_screenshot.jpg"
    },
    {
      "movie_id": 105,
      "title": "Back to the Future",
      "fake_location_name": "The Clock Tower square",
      "real_location_name": "Courthouse Sqare, North Hollywood California",
      "latitude": 34.14159865444757,
      "longitude": -118.34980167522463,
      "day": 45,
      "screenshot": "/blank_screenshot.jpg"
    },
    {
      "movie_id": 891850,
      "title": "Amelie",
      "fake_location_name": "Amelie Cafe",
      "real_location_name": "Café de los Molinos, Paris (Cafe des 2 moullins)",
      "latitude": 48.88509601831619,
      "longitude": 2.3336027507447583,
      "day": 46,
      "screenshot": "/blank_screenshot.jpg"
    }
  ]


var movies = [];
var directors = {};
var selectedMovie = {};


var movieOfTheDay = {};

var selectedMovieCardElement = document.getElementById("movieCard");
var selectedMoviePosterElement = document.getElementById("selectedMoviePoster");
var selectedMovieTitleElement = document.getElementById("selectedMovieTitle");
var selectedMovieYearElement = document.getElementById("selectedMovieYear");
var selectedMovieDirectorElement = document.getElementById("selectedMovieDirector");
let screenshotElement = document.getElementById("screenshot");

const imagebaseURL = "https://image.tmdb.org/t/p/";
const imageBaseSize = "w342";

//Crear las opciones que van en todas las consultas a la API de TMDB
const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmYzYwOTgxZGM5NGFjOTQxMmNiODgwZTIxNWU3YTQwNSIsInN1YiI6IjY1OWRiYmUwMjRiMzMzMDE0YzE0YTgzMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.4KYh99Desnirl47x-7tgNK369CA9mXpwxTbOeBccanM'
    }
};

async function Search(formInput){
    // console.log("Entering Search()");//LOG

    LimpiarLista();

    if (formInput == "" || formInput == null) {
        return;
    }
    
    SearchMovieByTitle(formInput);
}

function SearchMovieByTitle(searchQuery){
    // console.log("Entering SearchMovieByTitle()");//LOG
    if (searchQuery == "" || searchQuery == null){
        return;
    }

    movies = [];
    try {
        fetch('https://api.themoviedb.org/3/search/movie?query=' + encodeURI(searchQuery) + '&include_adult=false&language=en-US&page=1', options)
            .then(response => response.json())
            .then(response => {
                // console.log(response.results);//LOG
    
                movies = response.results;
    
                FollowTheSearchPath();
            })
            .catch(err => console.error(err));
    } catch {
        console.log("catcheado jajaj");
    }
}

function FollowTheSearchPath(){
    // console.log("Entering FollowTheSearchPath()");//LOG

    // for (let i = 0; i < movies.length; i++) {
    //     GetMoviesDirector(movies[i].id);
    // }

    UpdateListTitlesAndDate();
}

//Popula el objeto de directores con el director de la película enviada
function GetMoviesDirector(movie_id){
    // console.log("Entering GetMoviesDirector()");//LOG

    directors = {};
    fetch('https://api.themoviedb.org/3/movie/' + movie_id + '/credits?language=en-US', options)
        .then(response => response.json())
        .then(response => {
            // console.log(response);//LOG
            for(let i = 0; i < response.crew.length; i++){
                if (response.crew[i].job == "Director") {
                    // console.log(movie_id);//LOG
                    // console.log("Director Encontrado: " + response.crew[i].original_name)//LOG
                    if (!directors[movie_id]) {
                        directors[movie_id] = response.crew[i].original_name;
                    }

                    UpdateTableDirector(movie_id + "_director", response.crew[i].original_name);
                }
            }
        })
        .catch(err => console.error(err));
}

function UpdateTableDirector(cell_id, name){
    let directorCell = document.getElementById(cell_id);
    directorCell.textContent = name;
}

function UpdateListTitlesAndDate() {
    //Se obtiene el contenedor donde se agregan las películas encontradas
    let autocompleteList = document.getElementById("autocomplete");

    //Se obtiene la fila con el mensaje de "searching..."
    let placeholderRow = document.getElementById("searching");
    if (placeholderRow) 
        placeholderRow.remove();

    let oldListBody = document.getElementById("autocomplete-list");
    if (oldListBody) 
        LimpiarLista();

    let newListBody = document.createElement("div");
    newListBody.id = "autocomplete-list";
    newListBody.setAttribute("class", "autocomplete-items");
    newListBody.setAttribute("overflow-x", "scroll")

    for (let i = 0; i < movies.length; i++) {
        //Por cada película se agrega una fila en la tabla
        let newRow = document.createElement("div");
        newRow.id = movies[i].id;
        newRow.addEventListener("click", (event) => { SelectMovieFromTable_part1(movies[i]) });
        
        //Obtener sólo el año de salida de la película como texto
        let releaseYear = movies[i].release_date.split("-")[0];

        newRow.innerHTML = movies[i].title + " (" + releaseYear + ") ";

        // let titleCell = document.createElement("td");
        // titleCell.textContent = movies[i].original_title;
        // titleCell.id = movies[i].id + "_title";

        // let dateCell = document.createElement("td");
        // dateCell.textContent = movies[i].release_date;
        // dateCell.id = movies[i].id + "_date";

        // let directorCell = document.createElement("td");
        // directorCell.textContent = "";
        // directorCell.id = movies[i].id + "_director";

        // newRow.appendChild(titleCell);
        // newRow.appendChild(dateCell);
        // newRow.appendChild(directorCell);

        newListBody.appendChild(newRow);
    };

    autocompleteList.appendChild(newListBody);
}

function LimpiarLista(){
    // console.log("Entering LimpiarTabla()");//LOG

    let oldListBody = document.getElementById("autocomplete-list");
    if (oldListBody) {
        oldListBody.remove();
    }
}

function SelectMovieFromTable_part1(movieObject) {
    selectedMovie = movieObject;
    GetMovieCardInfo(movieObject.id);
}

function GetMovieCardInfo(movie_id) {
    fetch('https://api.themoviedb.org/3/movie/' + movie_id + '/images', options)
        .then(response => response.json())
        .then(response => {
            if (response.posters.length > 0) {
                // console.log("Poster fetched for movie ID: " + movie_id);//LOG
                SelectMovieFromTable_part2(movie_id);
            }
        })
        .catch(err => console.error(err));
}

function SelectMovieFromTable_part2(movie_id) {
    directors = {};
    fetch('https://api.themoviedb.org/3/movie/' + movie_id + '/credits?language=en-US', options)
    .then(response => response.json())
    .then(response => {
        // console.log(response);//LOG
        for(let i = 0; i < response.crew.length; i++){
            if (response.crew[i].job == "Director") {
                // console.log(movie_id);//LOG
                // console.log("Director Encontrado: " + response.crew[i].original_name)//LOG
                if (!directors[movie_id]) {
                    directors[movie_id] = response.crew[i].original_name;
                }
            }
        }

        selectedMoviePosterElement.src = imagebaseURL + imageBaseSize + selectedMovie.poster_path;
        selectedMovieDirectorElement.innerHTML = 'Directed by <span class="director-name">' + directors[movie_id] + '<span>';
        selectedMovieTitleElement.textContent = selectedMovie.title;
        selectedMovieYearElement.textContent = selectedMovie.release_date.split("-")[0];
        selectedMovieCardElement.style.display = "flex";
    })
    .catch(err => console.error(err));
}

function SelectTodaysMovie(){
    let date = new Date();
    let day = (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(date.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000;

    console.log("Día del año: " + day);//LOG

    for (let movie of movieData){
        if (movie.day == day) {
            movieOfTheDay = movie;
            return movie;
        }
    }
}

function SetMovieTitleInPage(){
    var movie = SelectTodaysMovie();
    var title = movie.title;

    console.log(movieOfTheDay.screenshot);
    screenshotElement.src = movieOfTheDay.screenshot;
    // console.log("Título de la película: " + title);//LOG
}

function MakeGuess(){

    MakePointOnLocation(movieOfTheDay.latitude, movieOfTheDay.longitude, movieOfTheDay.real_location_name);
    // console.log("Guessed");
}

SetMovieTitleInPage();//Call on load