
const liste = document.getElementById("liste");

let contenu = "<table class=\"table\"><thead><tr>";

function DateToString(str) {
    var date = new Date(str),
        mnth = ("0" + (date.getMonth() + 1)).slice(-2),
        day = ("0" + date.getDate()).slice(-2);
    return [day,mnth, date.getFullYear()].join("/");
}

async function get() {
    //Appel de la fonction getVisions exposée par le preload
    const resultat = await todosAPI.getAll()

    console.log(resultat)

    const keys = Object.keys(resultat[0])

    keys.forEach((key) => {
        console.log(key)
        contenu += `<th scope="col">${key}</th>`
    });


contenu += "</tr></thead><tbody>"

resultat.forEach((todos) => {

    contenu += "<tr>"

    Object.values(todos).forEach((value) => {

        console.log(typeof value)

        if (typeof value == "object"){
            let DateString = DateToString(value)
            contenu += `<td>${DateString}</td>`

        }else{
            contenu += `<td>${value}</td>`

        }
    })

    contenu += "</tr>"

});

contenu += "</tbody></table>"


liste.innerHTML = contenu


}

get()












