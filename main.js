//processus principal

const {app,BrowserWindow,ipcMain, Menu} =  require("electron")
const path = require('path')

//crée la fenêtre principale

let window

function createwindow() {

    window = new BrowserWindow({
        width:800,
        height:600,
        webPreferences : {
            nodeIntegration : false, //Accès aux API Node depuis le processus de rendu (pas sécuriser en true)
            contextIsolation : true,
            sandbox: true,
            preload : path.join(__dirname,'src/js/preload.js')
        }
    })

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


















