//processus principal

const {app,BrowserWindow,ipcMain} =  require("electron")
const path = require('path')

//crée la fenêtre principale

function createwindow() {

    const window = new BrowserWindow({
        width:800,
        height:600,
        webPreferences : {
            nodeIntegration : false, //Accès aux API Node depuis le processus de rendu (pas sécuriser en true)
            contextIsolation : true,
            sandbox: true,
            preload : path.join(__dirname,'src/js/preload.js')
        }
    })

    window.loadFile('src/pages/index.html')

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


















