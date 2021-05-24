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
                    switch(e.target.id) {
                        case "reloadBtn":
                            location.href = location.href;
                            break;
                        case "aboutBtn":
                            
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