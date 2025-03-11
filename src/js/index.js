const electronVersion = document.querySelector("#electron-version")
const nodeVersion = document.querySelector("#node-version")
const chromiumVersion = document.querySelector("#chromium-version")

//let versions2 = async () => await versions.getVersions()

//console.log(versions2)

async function lesVersions() {
    //Appel de la fonction getVisions exposée par le preload
    const version3 = await versions.getVersions()
    console.log(version3)

    electronVersion.textContent = version3.electron
    nodeVersion.textContent = version3.node
    chromiumVersion.textContent = version3.chromium
}

lesVersions()















