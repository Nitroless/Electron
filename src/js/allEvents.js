var nitrolessEvents = {
    sidebar: document.getElementById("sidebar"),
    searchbar: document.getElementById("searchInput"),
    loadSearchEvents: function() {
        
    },
    loadSidebarEvents: function() {
        eventHandler.addEvent(this.sidebar, {
            event: "click",
            label: "sidebarEvents",
            callback: (e) => {
                if(e.target.classList.contains("sidebar-btn")) {
                    let sidebarBtns = document.getElementsByClassName("sidebar-btn");
                    for(let i = 0; i < sidebarBtns.length; i++) {
                        if(sidebarBtns[i].classList.contains("active")) {
                            sidebarBtns[i].classList.remove("active");
                        }
                    }
                    e.target.classList.add("active");
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
    }
}