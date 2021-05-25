var home = {
    repoEmotes: [],
    mostUsedEmotes: [],
    loadEmotes: async function(api_uri) {
        try {
            const resp = await fetch(`${api_uri}index.json`);
            this.r = await resp.json();
            let sortedEmotes = this.r.emotes.sort(this.dynamicSorting("name"));
            let repoId = this.r.name.split(" ").join("");
            repoId = repoId.split("'").join("");
            this.repoEmotes.push({
                "id": repoId,
                "api_uri": api_uri,
                "name": this.r.name,
                "path": this.r.path,
                "emotes": sortedEmotes,
            });
        } catch(err) {
            console.error(err);
        }
    },
    displaySidebarRepo: function(repo) {
        const htmlContainer = domMaker.init({
            type: "div",
            id: repo.id + "SidebarBtn",
            className: "sidebar-btn repoList",
            innerHTML: `
            <div class="sidebar-btn-icon" style="background-image: url('${repo.api_uri}RepoImage.png')"></div>
            <div class="sidebar-btn-title">${repo.name}</div>
            `
        });
        eventHandler.addEvent(htmlContainer, {
            event: "click",
            label: "sidebarRepoEvents",
            callback: (e) => {
                let scrollTo = document.getElementById(e.target.id.substring(0, e.target.id.length - 10));
                scrollTo.parentNode.scroll({
                    top: scrollTo.offsetTop - scrollTo.parentNode.offsetTop,
                    behaviour: "smooth"
                });
            }
        });
        return htmlContainer;
    },
    displayEmotes: function(repo) {
        const htmlString = repo.emotes.map((emote) => {
            return `
            <div id="${emote.name}${emote.type}" class="emoteContainer" data-clipboard-text="${repo.api_uri}${repo.path}/${emote.name}${emote.type}">
                <img src="${repo.api_uri}${repo.path}/${emote.name}${emote.type}" id="${emote.name}${emote.type}Img" class="emoteImage" name="${emote.name}" />
            </div>
            `
        }).join('');
        const htmlContainer = domMaker.init({
            type: "div",
            id: repo.id,
            className: "repoContainer",
            innerHTML: `
                <div class="repoDetail">
                    <div class="repoInfo">
                        <div class="repoInfoIcon">
                            <img src="${repo.api_uri}RepoImage.png" class="repoImage" />
                        </div>
                        <div class="repoInfoDetail">
                            <div class="repoInfoName">${repo.name}</div>
                            <div class="repoURL">${repo.api_uri}</div>
                        </div>
                        <div id="${repo.id}Chevron" class="mi mi-ChevronDown"></div>
                    </div>
                </div>
                <div id="${repo.id}Emotes" class="repoEmotes">
                    ${htmlString}
                </div>
            `
        });
        eventHandler.addEvent(htmlContainer, {
            event: "click",
            label: "repoHeaderEvents",
            callback: (e) => {
                if(e.target.className !== "menuButton mi mi-ButtonMenu" && e.target.className !== "emoteContainer" && e.target.className !== "emoteImage" && e.target.className !== "repoEmotes") {
                    document.getElementById(repo.id + "Chevron").classList.toggle("closed");
                    let section = document.getElementById(repo.id + "Emotes");
                    let isCollapsed = section.getAttribute('data-collapsed') === 'true';
                    if(isCollapsed) {
                        home.expandSection(section);
                        section.setAttribute('data-collapsed', 'false');
                    } else {
                        home.collapseSection(section);
                    }
                }
            }
        });
        eventHandler.addEvent(htmlContainer, {
            event: "contextmenu",
            label: "repoHeaderEventsCM",
            callback: (e) => {
                if(e.target.classList.contains("repoDetail")) {
                    e.preventDefault();
                    let id = e.target.id;
                    if(!e.target.id) {
                        id = e.target.parentElement.id;
                    } else if(!e.target.parentElement.id) {
                        id = e.target.parentElement.parentElement.id;
                    } else {
                        id = e.target.parentElement.parentElement.parentElement.id;
                    }
                    electron.ipcRenderer.send("show-context-menu", id);
                }
            }
        });
        electron.ipcRenderer.once('removeRepo', (e, repoID) => {
            let obj = home.repoEmotes.filter((obj) => {
                return obj.id === repoID;
            });
            let r = confirm("Delete Repo: " + obj[0].name + "?");
            if (r == true) {
                let uri = obj[0].api_uri;
                localstore.removeRepo("addedRepos", uri);
                alert("Repo Deleted!");
                eventHandler.removeAllEvents();
                nitrolessEvents.init();
                home.init();
            } else {
                eventHandler.removeAllEvents();
                nitrolessEvents.init();
                home.init();
            }
        })
        return htmlContainer;
    },
    copySuccess: function(e) {
        document.getElementById("copyFloat").classList.add("show");
        setTimeout(() => {
            document.getElementById("copyFloat").classList.remove("show");
        }, 1000);
        if(localstore["mostUsedEmotes"] && localstore["mostUsedEmotes"].some((obj) => obj === e.text)) {
            localstore.moveValueToFirstIndex("mostUsedEmotes", e.text);
        } else {
            localstore.addArrayValue("mostUsedEmotes", e.text);
        }
        home.mostUsedEmotes = [];
        for(let i = 0; i < localstore["mostUsedEmotes"].length; i++) {
            home.mostUsedEmotes.push(localstore.mostUsedEmotes[i]);
        }
        home.mostUsedEmotesMaker();
    },
    copyFailure: function(e) {
        alert('Couldn\'t copy ' + e.trigger);
    },
    mostUsedEmotesMaker: function() {
        if(localstore["mostUsedEmotes"]) {
            if(document.getElementById("mostUsedEmotes")) {
                document.getElementById("mostUsedEmotes").innerHTML = "";
                if(home.mostUsedEmotes.length) {
                    const htmlString = home.mostUsedEmotes.map((emote) => {
                        return `
                        <div class="emoteContainer" data-clipboard-text="${emote}">
                            <img src="${emote}" class="emoteImage" />
                        </div>
                        `
                    }).join('');
                    document.getElementById("mostUsedEmotes").innerHTML = htmlString;
                } else {
                    for(let i = 0; i < localstore["mostUsedEmotes"].length; i++) {
                        home.mostUsedEmotes.push(localstore.mostUsedEmotes[i]);
                    }
                    this.mostUsedEmotesMaker();
                }
            } else {
                document.getElementById("sidebarContent").prepend(domMaker.init({
                    type: "div",
                    id: "mostUsedEmotes"
                }));
                this.mostUsedEmotesMaker();
            }
        }
    },
    dynamicSorting: function(property) {
        let sortOrder = 1;
        if(property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function(a,b) {
            if(sortOrder == -1) {
                return b[property].localeCompare(a[property]);
            } else {
                return a[property].localeCompare(b[property]);
            }
        }
    },
    collapseSection: function(element) {
        var sectionHeight = element.scrollHeight;
        var elementTransition = element.style.transition;
        element.style.transition = '';
        requestAnimationFrame(function() {
            element.style.height = sectionHeight + 'px';
            element.style.transition = elementTransition;
            requestAnimationFrame(function() {
            element.style.height = 0 + 'px';
            });
        });
        element.setAttribute('data-collapsed', 'true');
    },
    expandSection: function(element) {
        var sectionHeight = element.scrollHeight;
        element.style.height = sectionHeight + 'px';
        element.addEventListener('transitionend', function(e) {
            element.removeEventListener('transitionend', arguments.callee);
            element.style.height = null;
        });
        element.setAttribute('data-collapsed', 'false');
    },
    init: async function() {
        document.getElementById("sidebarContent").innerHTML = "";
        document.getElementById("addedRepos").innerHTML = "";
        this.repoEmotes = [];
        this.mostUsedEmotes = [];
        document.getElementById("sidebarContent").appendChild(domMaker.init({
            type: "div",
            id: "loading",
            innerHTML: `
                <div class='loadingCircle'></div>
                <div class='loadingCircle'></div>
                <div class='loadingCircle'></div>
                <div class='loadingCircle'></div>
                <div class='loadingCircle'></div>
            `
        }));
        for(let i = 0; i < localstore.addedRepos.length; i++) {
            await home.loadEmotes(localstore.addedRepos[i]);
        }
        document.getElementById("sidebarContent").removeChild(document.getElementById("loading"));
        for(let i = 0; i < home.repoEmotes.length; i++) {
            document.getElementById("sidebarContent").appendChild(home.displayEmotes(home.repoEmotes[i]));
        }
        for(let i = 0; i < home.repoEmotes.length; i++) {
            document.getElementById("addedRepos").appendChild(home.displaySidebarRepo(home.repoEmotes[i]));
        }
        this.mostUsedEmotesMaker();
        FluentRevealEffect.applyEffect(".repoDetail", {
            clickEffect: true,
            lightColor: "rgba(255,255,255,0.2)",
            gradientSize: 200
        });
        FluentRevealEffect.applyEffect(".sidebar-btn", {
            clickEffect: true,
            lightColor: "rgba(255,255,255,0.2)",
            gradientSize: 150
        });
        let clipboard = new ClipboardJS('.emoteContainer');
        clipboard.on('success', this.copySuccess);
        clipboard.on('error', this.copyFailure);
    }
}