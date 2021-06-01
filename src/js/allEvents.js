var nitrolessEvents = {
    searchFlag: false,
    sidebar: document.getElementById("sidebar"),
    searchbar: document.getElementById("searchInput"),
    addRepo: document.getElementById("addRepo"),
    loadAddRepoEvent: function() {
        eventHandler.addEvent(this.addRepo, {
            event: "click",
            label: "addRepoEvent",
            callback: function(e) {
                let addRepoWindow = domMaker.init({
                    type: "div",
                    id: "addRepoWindow",
                    className: "promptWindows closed",
                    innerHTML: `
                    <div id="titlebar">
                        <div class="title">Add Repo</div>
                        <div class="mi mi-ChromeClose"></div>
                    </div>
                    <div class="content">
                        <div class="label">Repo's URL:</div>
                        <div class="urlInput">
                            <input id="addRepoURL" class="inputTextField" type="url" placeholder="https://nitroless.github.io/ExampleNitrolessRepo/" />
                        </div>
                        <div class="promptButtons">
                            <div id="okButton" class="promptButton">Ok</div>
                            <div id="cancelButton" class="promptButton">Cancel</div>
                        </div>
                    </div>
                    `
                });
                setTimeout(() => {
                    addRepoWindow.classList.remove("closed");
                }, 10);
                document.body.appendChild(addRepoWindow);
                eventHandler.addEvent(document.getElementsByClassName("mi-ChromeClose")[0], {
                    event: "click",
                    label: "removeAddRepoWindow",
                    callback: function(e) {
                        document.getElementById("addRepoWindow").classList.add("closed");
                        setTimeout(() => document.body.removeChild(document.getElementById("addRepoWindow")), 250);
                        eventHandler.removeAllEvents();
                        nitrolessEvents.init();
                        home.init();
                    }
                });
                eventHandler.addEvent(document.getElementsByClassName("promptButtons")[0], {
                    event: "click",
                    label: "addRepoButtonsEvents",
                    callback: async function(e) {
                        if(e.target.id === "okButton") {
                            addRepo = document.getElementById("addRepoURL").value;
                            if(addRepo !== null && addRepo !== "https://") {
                                try {
                                    if(!addRepo.endsWith("/")) {
                                        addRepo = addRepo + "/";
                                    }
                                    const response = await fetch(`${addRepo}index.json`);
                                    localstore.addRepo("addedRepos", addRepo);
                                    eventHandler.removeAllEvents();
                                    home.init();
                                } catch(e) {
                                    alert("oof, Repo couldn't be Added, please contact the Repo Maintainer and show them this error. \n\n" + e);
                                }
                            }
                        }
                        document.getElementById("addRepoWindow").classList.add("closed");
                        setTimeout(() => {
                            document.body.removeChild(document.getElementById("addRepoWindow"));
                            nitrolessEvents.init();
                        }, 250);
                    }
                });
                FluentRevealEffect.applyEffect(".urlInput", {
                    clickEffect: true,
                    lightColor: "rgba(255,255,255,0.2)",
                    gradientSize: 200
                });
                FluentRevealEffect.applyEffect(".promptButton", {
                    clickEffect: true,
                    lightColor: "rgba(255,255,255,0.2)",
                    gradientSize: 150
                });
            }    
        });
    },
    loadSearchEvents: function() {
        eventHandler.addEvent(this.searchbar, {
            event: "search",
            label: "searchbarEvents2",
            callback: () => {
                if(document.getElementById("sidebarContent").classList.contains("searchContent")) {
                    document.getElementById("sidebarContent").classList.remove("searchContent");
                }
                eventHandler.removeAllEvents();
                nitrolessEvents.init();
                home.init();
            }
        })
        eventHandler.addEvent(this.searchbar, {
            event: "keyup",
            label: "searchbarEvents",
            callback: (e) => {
                nitrolessEvents.searchFlag = true;
                if(e.target.value) {
                    const searchString = e.target.value.toLowerCase();
                    let filteredEmotes = [];
                    for(let i = 0; i < home.repoEmotes.length; i++) {
                        filteredEmotes.push({
                            api_uri: home.repoEmotes[i].api_uri,
                            path: home.repoEmotes[i].path,
                            emotes: home.repoEmotes[i].emotes.filter((emote) => {
                                        return (emote.name.toLowerCase().includes(searchString));
                                    })
                        });
                    }
                    document.getElementById("sidebarContent").innerHTML = "";
                    document.getElementById("addedRepos").innerHTML = "";
                    home.mostUsedEmotes = [];
                    document.getElementById("sidebarContent").classList.add("searchContent");
                    let htmlString;
                    for(let i = 0; i < filteredEmotes.length; i++) {
                        let api_uri = filteredEmotes[i].api_uri;
                        let path = filteredEmotes[i].path;
                        let perRepoEmotes = filteredEmotes[i];
                        for(let i = 0; i < perRepoEmotes.emotes.length; i++) {
                            let emote = perRepoEmotes.emotes[i];
                            htmlString = `
                            <div id="${emote.name}${emote.type}" class="emoteContainer" data-clipboard-text="${api_uri}${path}/${emote.name}${emote.type}">
                                <div class="hover">${emote.name}</div>
                                <img src="${api_uri}${path}/${emote.name}${emote.type}" id="${emote.name}${emote.type}Img" class="emoteImage" name="${emote.name}" />
                            </div>
                            `
                            document.getElementById("sidebarContent").innerHTML += htmlString;
                        }
                    }
                    
                } else {
                    if(document.getElementById("sidebarContent").classList.contains("searchContent")) {
                        document.getElementById("sidebarContent").classList.remove("searchContent");
                    }
                    eventHandler.removeAllEvents();
                    nitrolessEvents.init();
                    home.init();
                }
            }
        });
    },
    loadSidebarEvents: function() {
        eventHandler.addEvent(this.sidebar, {
            event: "click",
            label: "sidebarEvents",
            callback: (e) => {
                if(e.target.classList.contains("sidebar-btn")) {
                    if(!e.target.classList.contains("repoList") && e.target.id !== "hamburgerMenu") {
                        let sidebarBtns = document.getElementsByClassName("sidebar-btn");
                        for(let i = 0; i < sidebarBtns.length; i++) {
                            if(sidebarBtns[i].classList.contains("active")) {
                                sidebarBtns[i].classList.remove("active");
                            }
                        }
                        e.target.classList.add("active");
                    }
                    switch(e.target.id) {
                        case "reloadBtn":
                            eventHandler.removeAllEvents();
                            location.href = location.href;
                            break;
                        case "homeBtn":
                            eventHandler.removeAllEvents();
                            nitrolessEvents.init();
                            home.init();
                            break;
                        case "aboutBtn":
                            eventHandler.removeAllEvents();
                            nitrolessEvents.init();
                            about.init();
                            break;
                        case "settingsBtn":
                            eventHandler.removeAllEvents();
                            nitrolessEvents.init();
                            about.init();
                            break;
                    }
                    e.target.style.backgroundImage = "none";
                }
            }
        })
    },
    init: function() {
        this.loadAddRepoEvent();
        this.loadSidebarEvents();
        this.loadSearchEvents();
    }
}