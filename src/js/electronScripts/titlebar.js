const electron = require("electron");

new (require("windowbar"))({
    style: "win",
    title: "Nitroless",
    dark: true,
    transparent: true,
    draggable: false
})
.on("minimize", () => electron.ipcRenderer.send("minimize"))
.on("close", () => electron.ipcRenderer.send("close"))
.appendTo(document.getElementById("windowbar"));

let windowbarControls = document.getElementsByClassName("windowbar-controls")[0];
windowbarControls.appendChild(domMaker.init({
    type: "div",
    id: "addRepo",
    className: "windowbar-addRepo mi mi-Add"
}));