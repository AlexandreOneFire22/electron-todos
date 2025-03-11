//  Ce script sera exécuté avant le chargement de la page
//  A accès aux API Node et Electron

const {contextBridge,ipcRenderer} = require("electron")

contextBridge.exposeInMainWorld('versions',{ //exposeInMainWorld est une méthode qui rajoute la valeur "versions" dans "window" (comme document)

    //fonction qui récupère les versions via IPC (lien entre Main Process et Render Process)
    getVersions: () => ipcRenderer.invoke("get-versions")
})

console.log("preload chargé avec succes")





// electron : process.versions.electron,
//     node : process.versions.node,
//     chromium : process.versions.chrome






