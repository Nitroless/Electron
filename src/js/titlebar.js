const electron = require("electron");

new (require("windowbar"))({
    style: "win",
    title: "Nitroless",
    dark: true,
    transparent: true,
    draggable: false
})
.on("minimize", () => electron.ipcRenderer.send("minimize"))
.appendTo(document.getElementById("windowbar"));