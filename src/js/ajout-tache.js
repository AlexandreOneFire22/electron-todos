
const addButton = document.getElementById("addButton");
const addTitre = document.getElementById("ajouterTitre");
const submit = document.getElementById("formulaire");

const titre = document.getElementById("titre");

function addChampTitre () {
    addTitre.append(`<input type="text" class="form-control" name="titre" placeholder="entrer le titre de votre Todos">`)
}

addButton.addEventListener("click", console.log("cc"));



submit.addEventListener("submit", async (event) => {
    event.preventDefault()
    await todosAPI.add(titre.value)
})





















