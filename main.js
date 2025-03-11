//processus principal

const {app,BrowserWindow} =  require("electron")

//crée la fenêtre principale

function createwindow() {

    const window = new BrowserWindow({
        width:800,
        height:600,
        webPreferences : {
            nodeIntegration : true, //Accès aux API Node depuis le processus de rendu (pas sécuriser en true)
            contextIsolation : false
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





















