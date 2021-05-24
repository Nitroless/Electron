var home = {
    repoEmotes: [],
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
                        <div class="mi mi-ChevronDown closed"></div>
                    </div>
                    <div id="${repo.id}" class="menuButton mi mi-ButtonMenu"></div>
                </div>
                <div class="repoEmotes">
                    ${htmlString}
                </div>
            `
        });
        // htmlContainer.addEventListener("click", (e) => {
        //     if(e.target.className !== "headerRightPart" && e.target.className !== "emoteContainer" && e.target.className !== "emoteImage" && e.target.className !== "repoEmotes") {
        //         document.getElementById(repo.id + "Chevron").classList.toggle("closed");
        //         document.getElementById(repo.id + "Emotes").classList.toggle("hide");
        //     }
        // });
        return htmlContainer;
    },
    copySuccess: function(e) {
        document.getElementById("copyFloat").classList.add("show");
        setTimeout(() => {
            document.getElementById("copyFloat").classList.remove("show");
        }, 1000);
    },
    copyFailure: function(e) {
        alert('Couldn\'t copy ' + e.trigger);
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
    init: async function() {
        document.getElementById("sidebarContent").innerHTML = "";
        this.repoEmotes = [];
        for(let i = 0; i < localstore.addedRepos.length; i++) {
            await home.loadEmotes(localstore.addedRepos[i]);
        }
        for(let i = 0; i < home.repoEmotes.length; i++) {
            document.getElementById("sidebarContent").appendChild(home.displayEmotes(home.repoEmotes[i]));
        }
        let clipboard = new ClipboardJS('.emoteContainer');
        clipboard.on('success', this.copySuccess);
        clipboard.on('error', this.copyFailure);
    }
}