const { shell } = require('electron');

var about = {
    containerMaker: function(params) {
        let subtitle = "";
        if(params.hasSubtitle) {
            subtitle = `<div class="aboutSubtitle">${params.subtitle}</div>`;
        }
        const htmlContainer = domMaker.init({
            type: "div",
            id: params.id,
            className: "aboutContainer",
            innerHTML: `
                <div class="aboutImage" style="background-image: url('assets/icons/brands/${params.imageName}')"></div>
                <div class="aboutDetail">
                    <div class="aboutTitle">${params.title}</div>
                    ${subtitle}
                </div>
            `
        });
        eventHandler.addEvent(htmlContainer, {
            event: "click",
            label: params.id,
            callback: (e) => {
                shell.openExternal(params.url);
            }
        })
        return htmlContainer;
    },
    init: function() {
        document.getElementById("sidebarContent").innerHTML = "";
        document.getElementById("addedRepos").innerHTML = "";
        domMaker.domAppender({
            div: document.getElementById("sidebarContent"),
            children: [
                this.containerMaker({
                    hasSubtitle: false,
                    id: "Github",
                    imageName: "github-logo.jpg",
                    title: "Source Code",
                    url: "https://github.com/paraskcd1315/Nitroless-Electron-App"
                }),
                this.containerMaker({
                    hasSubtitle: false,
                    id: "Twitter",
                    imageName: "twitter-icon.png",
                    title: "Follow us.",
                    url: "https://twitter.com/Nitroless_"
                }),
                this.containerMaker({
                    hasSubtitle: true,
                    id: "ParasKCD",
                    imageName: "kcd.jpg",
                    title: "Paras KCD",
                    subtitle: "Website | Electron App",
                    url: "https://twitter.com/ParasKCD"
                }),
                this.containerMaker({
                    hasSubtitle: true,
                    id: "Alpha",
                    imageName: "alpha.jpg",
                    title: "Alpha_Stream",
                    subtitle: "Website | Assets | Idea",
                    url: "https://twitter.com/Kutarin_"
                }),
                this.containerMaker({
                    hasSubtitle: true,
                    id: "Amy",
                    imageName: "amy.jpg",
                    title: "Amy",
                    subtitle: "iOS App | iOS Keyboard | macOS App",
                    url: "https://github.com/CharlieWhile13"
                }),
                this.containerMaker({
                    hasSubtitle: true,
                    id: "Alt",
                    imageName: "alt.jpg",
                    title: "Althio",
                    subtitle: "macOS App",
                    url: "https://twitter.com/a1thio"
                }),
                this.containerMaker({
                    hasSubtitle: true,
                    id: "Superbro",
                    imageName: "superbro.png",
                    title: "Superbro",
                    subtitle: "iOS App | iOS Keyboard",
                    url: "https://twitter.com/suuperbro"
                }),
                this.containerMaker({
                    hasSubtitle: true,
                    id: "Bypass",
                    imageName: "bypass.jpg",
                    title: "Bypass",
                    subtitle: "Website | Web App",
                    url: "https://twitter.com/imbypass"
                })
            ]
        });
        FluentRevealEffect.applyEffect(".aboutContainer", {
            clickEffect: true,
            lightColor: "rgba(255,255,255,0.2)",
            gradientSize: 150
        });
    }
}