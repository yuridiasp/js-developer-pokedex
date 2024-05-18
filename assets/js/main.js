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

    const { id, name, sprites, types } = pokemon
    const listTypes = types.reduce((list, type) => list + `<li class="type ${type.type.name}">${type.type.name}</li>`, "")
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