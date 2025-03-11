//  Ce script sera exécuté avant le chargement de la page
//  A accès aux API Node et Electron

const {contextBridge} = require("electron")

contextBridge.exposeInMainWorld('versions',{ //exposeInMainWorld est une méthode qui rajoute la valeur "versions" dans "window" (comme document)
    electron : process.versions.electron,
    node : process.versions.node,
    chromium : process.versions.chrome
})

console.log("preload chargé avec succes")












