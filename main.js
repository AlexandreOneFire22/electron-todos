//processus principal

const {app,BrowserWindow,ipcMain, Menu, dialog} =  require("electron")
const path = require('path')
const mysql = require('mysql2/promise')

//crée la fenêtre principale
let window

// Configuration de l'accès à la base de données
const dbConfig = {
    host : 'localhost',
    port: 3306,
    user: 'root',
    password : '',
    database : 'db_todos',
    connectionLimit : 10, //Nombre maximal de connexion dans le pool
    waitForConnections : true, //autorise une fill d'attente pour les requête si les 10 sont déjà pris
    queueLimit : 0 // 0 = illimité
}

//Créer le pool de connexion
const pool = mysql.createPool(dbConfig)


//Tester la connexion
async function testConnexion() {
    try {
        //Je vais demander une connexion au pool
        const connexion = await pool.getConnection()
        console.log("connexion avec la base de donnee etablie")
        connexion.release() //on rend la connexion disponible dans le pool
    }catch (error){
        console.error("Erreur de connexion")
    }
}

testConnexion()

//créer la fenêtre principale
function createwindow() {

    window = new BrowserWindow({
        width:1200,
        height:800,
        webPreferences : {
            nodeIntegration : false, //Accès aux API Node depuis le processus de rendu (pas sécuriser en true)
            contextIsolation : true,
            sandbox: true,
            preload : path.join(__dirname,'src/js/preload.js')
        }
    })

    //window.webContents.openDevTools();

    // Ajout du menu personnalisé
    createMenu()

    window.loadFile('src/pages/index.html')

}

//fonction permettant de créer un menu personnalisé
function createMenu() {

    //Crée un tableau qui va représenter le menu -> modèle
    const template = [
        {
          label : "App",
          submenu : [
              {
                  label : "Version",
                  click: () => window.loadFile('src/pages/index.html')
              },
              {
                type: "separator"
              },
              {
                  label: "Quitter",
                  accelerator: process.platform === "darwin" ? 'cmd+Q' : 'ctrl+Q',
                  click: () => app.quit()
              }
          ]
        },
        {
            label: "Tâche",
            submenu: [
                {
                    label: "Lister",
                    click: () => window.loadFile('src/pages/liste-taches.html')
                },
                {
                    label: "ajouter",
                    click: () => window.loadFile('src/pages/ajout-tache.html')
                }
            ]
        },
        {
            label: "Dev",
            click: () => window.webContents.openDevTools()

        }
    ]

    //Créer le menu à partir du modèle
    const menu = Menu.buildFromTemplate(template)

    //Définir le menu comme étant le menu de l'application
    Menu.setApplicationMenu(menu)

}


// Attendre l'initialisation de l'application au démarrage

app.whenReady().then(() => {

    console.log("application initialise")

    createwindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createwindow()
        }
    })
})


app.on('window-all-closed',()=> {
    if(process.platform !== 'darwin'){
        app.quit()
    }
})


//Ecouter sur le canal "get-versions"

ipcMain.handle("get-versions", () => {
    //renvoyer un objet des valeurs des versions des logiciel
    return{
        electron : process.versions.electron,
        node : process.versions.node,
        chromium : process.versions.chrome
    }
})

async function getAllTodos() {

    try {
        const resultat = await pool.query('SELECT * FROM todos ORDER BY createdAt DESC')
        return resultat[0]    //retourne une promesse avec le resultat
    }catch (error){
        console.error("erreur lors de la récupération des tâches")
        throw error //retourne une promesse non résolue
    }
}

//Ecouter sur le canal "todos:getAll"
ipcMain.handle("todos:getAll", async () => {
    //récuperer la liste des tâches dans la base de données avec mysql
    try {
        return await getAllTodos()  //retourne une promesse
    }catch (error){
        dialog.showErrorBox("Une erreur est survenue","impossible de récupérer la liste des tâches")
        return []   // promesse (fonction) résolue mais avec un tableau vide
    }
})



async function addTodos(titres) {

    try {
        let requete = "INSERT INTO todos (titre, termine, createdAt) VALUES "
        titres.forEach((titre) => {
            requete += `('${titre}',0, ${Date.now()}),`
        })
        requete = requete.slice(0, -1) + ";"
        const resultat = await pool.query(requete)
        return;   //retourne une promesse avec le resultat
    }catch (error){
        console.error("erreur lors de la récupération des taches")
        throw error //retourne une promesse non résolue
    }
}

ipcMain.handle('todos:add', async (event,titres) => {
    //récuperer la liste des tâches dans la base de données avec mysql
    try {
        await addTodos(titres)  //retourne une promesse
    }catch (error){
        dialog.showErrorBox("Une erreur est survenue","impossible d'enregistrer les todos")
        return []   // promesse (fonction) résolue mais avec un tableau vide
    }
})










