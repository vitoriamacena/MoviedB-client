const baseUrl = "http://localhost:3000";
const listfilmes = document.getElementById('movies');
const searchBar = document.getElementById('searchBar');
let output = '';
let editar = false;
let idEdicao = 0;
let isChecked;

function getFilmes() {
    fetch(`${baseUrl}/filmes`)
    .then((res) => res.json())
    .then((data) => {

        data.map(filme => {
            listfilmes.insertAdjacentHTML('beforeend', `
            <div class="movie">
                <div id="icons">
                    <h3 onclick="deleteFilmes('${filme._id}')">✖</h3>
                </div>
                <img id="cover" src=${filme.imagem} alt="${filme.titulo}">
                
                <div class="movie-info"> 
                    <h3 id="titulo">${filme.titulo}</h3>
                    <h3 id="nota">${filme.nota}</h3>
                </div>
                <div class="movie-info">
                    <h4 id="genero">${filme.genero}</h4>
                    <h5 onclick="editaFilme('${filme._id}')">Editar</h5>
                </div>
            </div>
            `);
        });
    });
};

getFilmes();

function checkBox() {
    if(document.getElementById("fassistido").checked) {
        isChecked = true
    } else {
        isChecked = false
    }
    console.log(isChecked)
};

async function submitForm(e) {
    e.preventDefault()

    checkBox();

    const filme = {
     assistido: isChecked,
     titulo: document.getElementById('ftitulo').value,
     genero: document.getElementById('fgenero').value,
     nota: document.getElementById('fnota').value,
     imagem: document.getElementById('fimagem').value,
    }

    // const filme = {        
    //     titulo: titulo.value,
    //     genero: genero.value,
    //     nota: nota.value,
    //     cover: cover.value
    // }

    if(!editar) {
        
        const req = new Request(`${baseUrl}/filmes/create`, {
            method: 'POST',
            body: JSON.stringify(filme),
            headers: new Headers( {
                'Content-Type': 'application/json'
            })
        })

        const res = await fetch(req);
        const result = await res.json();

        if(result) {
            getFilmes();
        }
    } else {
        const req = new Request(`${baseUrl}/filmes/update/${idEdicao}`, {
            method: 'PUT',
            body: JSON.stringify(filme),
            headers: new Headers( {
                'Content-Type': 'application/json'
            })
        })

        const res = await fetch(req);
        const result = await res.json();

        if(result) {
            editar = false;
            getFilmes();
        }
    }

    titulo.value = '';
    genero.value = '';
    cover.value = '';
    nota.value = '';

    listfilmes.innerHTML = '';
}

async function getById(id) {
    const res = await fetch(`${baseUrl}/filmes/${id}`);
    return filme = res.json();
}

async function searchFilme() {
    searchBar.addEventListener('keyup', async (e) => {
        if (e.key === 'Enter') {
            const value = (e.target.value)
            const filme = await getById(value)
            console.log(filme);
            listfilmes.innerHTML = ''
            listfilmes.insertAdjacentHTML('beforeend',
                `<div class="movie">
                    <div id="icons">
                        <h3 onclick="deleteFilmes('${filme._id}')">✖</h3>
                    </div>
                    <img id="cover" src=${filme.imagem} alt="${filme.titulo}">
                    
                    <div class="movie-info"> 
                        <h3 id="titulo">${filme.titulo}</h3>
                        <h3 id="nota">${filme.nota}</h3>
                    </div>
                    <div class="movie-info">
                        <h4 id="genero">${filme.genero}</h4>
                        <h5 onclick="editaFilme('${filme._id}')">Editar</h5>
                    </div>
                </div>
                `)};
    })
        
}


async function editaFilme(id) {
    
    editar = true;
    idEdicao = id;
    const filme = await getById(id);

    let movieId = document.getElementById('id');
    let title = document.getElementById('ftitulo');
    let genre = document.getElementById('fgenero');
    let note = document.getElementById('fnota');
    let image = document.getElementById('fimagem');

    movieId.value = filme._id;
    title.value = filme.titulo;
    genre.value = filme.genero;
    note.value = filme.nota;
    image.value = filme.imagem;
}

async function deleteFilmes(id) {
    const req = new Request(`${baseUrl}/filmes/delete/${id}`, {
        method: 'DELETE',
    })
    const res = await fetch(req);
    const data = await res.json();
    listfilmes.innerHTML = '';
    getFilmes();
    
}