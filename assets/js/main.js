const pokemonsList = document.querySelector(".pokemons")
const limite = 20

let nextPage = `https://pokeapi.co/api/v2/pokemon?limit=${limite}&offset=0`;

function formatNumber(num) {
    const formattedNum = num.toString().padStart(3, '0')
    
    return '#' + formattedNum
}

function onScroll() {
    const observeLastPokemon = pokemonsObserver => {
        const lastPokemon = pokemonsList.lastChild
        pokemonsObserver.observe(lastPokemon)
    }

    const pokemonsObserver = new IntersectionObserver(([lastPokemon], observe) => {
        if (!lastPokemon.isIntersecting) {
            return
        }

        loadPagePokemon()
        observe.unobserve(lastPokemon.target)
        observeLastPokemon(pokemonsObserver)
    })

    observeLastPokemon(pokemonsObserver)
}

function createElementList (pokemon) {
    const colorsTypes = {
        water: "#6890f0",
        fire: "#f05030",
        grass: "#f05030",
        electric: "#78c850",
        psychic: "#f85888",
        ice: "#98d8d8",
        dragon: "#7038f8",
        dark: "#705848",
        normal: "#a8a878",
        fight: "#903028",
        flying: "#a890f0",
        poison: "#a040a0",
        ground: "#e0c068",
        rock: "#b8a038",
        bug: "#a8b820",
        ghost: "#705898",
        steel: "#b8b8d0",
        "???": "#68a090",
    }

    const { id, name, sprites, types } = pokemon
    const listTypes = types.reduce((list, type) => list + `<li class="type" style="background-color: ${colorsTypes[type.type.name]}">${type.type.name}</li>`, "")
    const li = document.createElement("li")
    
    li.classList.add("pokemon")

    const html = `<span class="number">${formatNumber(id)}</span>
                    <span class="name">${name}</span>

                    <div class="detail">
                        <ol class="types">
                            ${listTypes}
                        </ol>

                        <img src="${sprites.other.dream_world.front_default}"
                            alt="Bulbasaur">
                    </div>`
    
    li.innerHTML = html
    pokemonsList.append(li)
}

function readDataPokemons (pokemons) {
    pokemons.forEach(pokemon => {
        createElementList(pokemon)
    })
}

function getPokemons (result) {
    const { next, results } = result

    nextPage = next

    const promises = results.map(result => {
        return requestJsonPokemon(result.url)
    })

    return promises
}

async function requestJsonPokemon (url) {
    return fetch(url)
        .then(result => result.json())
        .then(json => json)
        .catch(err => {
            console.log(err)
        })
};

async function loadPagePokemon () {
    return requestJsonPokemon(nextPage)
        .then(resultado => {
            return getPokemons(resultado)
        }).then(async promises => {
            return Promise.all(promises).then(pokemons => {
                readDataPokemons(pokemons)
            })
        })
        .catch(error => {
            console.log(error)
        })
}

loadPagePokemon().then(() => {
    onScroll()
})