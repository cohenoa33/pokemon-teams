const BASE_URL = "http://localhost:3000";
const TRAINERS_URL = `${BASE_URL}/trainers`;
const POKEMONS_URL = `${BASE_URL}/pokemons`;

fetchTrainersData();
addEventListenetoMain();

// When a user loads the page, they should see all trainers, with their current team of Pokemon.
function fetchTrainersData() {
  fetch(TRAINERS_URL)
    .then((response) => response.json())
    .then((trainers) =>
      trainers.forEach((trainer) => addToTtrainerCollection(trainer))
    );
}
// create trainer card
function addToTtrainerCollection(trainer) {
  const trainerConatiner = document.querySelector("main");
  trainerConatiner.innerHTML += renderTrainer(trainer);
}
//add innerHtml, iterate over trainer.pokemons to get the trainer pokemons
function renderTrainer(trainer) {
  return `
    <div class="card" data-id=${trainer.id}><p>${trainer.name}</p>
    <button class="addPokemon" data-trainer-id=${
      trainer.id
    }>Add Pokemon</button>
    <ul>
    ${trainer.pokemons
      .map((pokemon) => {
        return `<li> ${pokemon.nickname} (${pokemon.species}) <button class="release" data-pokemon-id=${pokemon.id}>
        Release </button> </li> `;
      })
      .join(" ")}
    </ul>`;
}
// Whenever a user hits Release Pokemon on a specific Pokemon team, that specific Pokemon should be released from the team.

// 2. by specific Id sending POST to server (backend) and update frontend
//  listen to click on main
function addEventListenetoMain() {
  const mainContainer = document.getElementsByTagName("main")[0];
  mainContainer.addEventListener("click", eventTarget);
}
//recognize if the click is on release or add
function eventTarget(event) {
  event.preventDefault();
  if (event.target.className === "release") {
    releasePokemonFromTrainer(event);
  } else if (event.target.className === "addPokemon") {
    addnNewPokemon(event);
  }
}
function releasePokemonFromTrainer(event) {
  const pokemonId = event.target.dataset.pokemonId;
  const urlToDelete = `${POKEMONS_URL}/${pokemonId}`;

  //   delete backend;
  fetch(urlToDelete, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((pokemon) => console.log(pokemon));

  //delete frontend
  const pokemontoDelete = event.target.parentElement;
  pokemontoDelete.remove();
}

// Whenever a user hits Add Pokemon and they have space on their team, they should get a new Pokemon.
function addnNewPokemon(event) {
  const trainerId = +event.target.dataset.trainerId;
  const counter = event.target.parentElement.querySelectorAll("li");
  const list = event.target.nextElementSibling;

  if (counter.length < 6) {
    // fetchNewPokemon(trainerId);
    fetch(POKEMONS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        trainer_id: trainerId,
      }),
    })
      .then((response) => response.json())
      .then((pokemon) => (list.innerHTML += createPokemonLiItem(pokemon)));
  } else {
    alert`Sorry, can't add more pokemon to this trainer`;
  } //end of if statement
} // end of function

function createPokemonLiItem(pokemon) {
  return `<li>${pokemon.nickname} (${pokemon.species}) <button class="release" data-pokemon-id="${pokemon.id}">Release</button></li>`;
}

function fetchNewPokemon(trainerId) {
  fetch(POKEMONS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      trainer_id: trainerId,
    }),
  })
    .then((response) => response.json())
    .then((pokemon) => createPokemonLiItem(pokemon));
}
