var nitrolessEvents = {
    searchFlag: false,
    sidebar: document.getElementById("sidebar"),
    searchbar: document.getElementById("searchInput"),
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
                            e.target.style.backgroundImage = "none";
                            break;
                        case "aboutBtn":
                            eventHandler.removeAllEvents();
                            nitrolessEvents.init();
                            about.init();
                            break;
                    }
                }
            }
        })
    },
    init: function() {
        this.loadSidebarEvents();
        this.loadSearchEvents();
    }
}