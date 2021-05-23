var eventHandler = {
    allEvents: [],
    addEvent: function(div, params) {
        this.allEvents.push({
            div: div,
            event: params.event,
            callback: params.callback,
            label: params.label
        });
        div.addEventListener(params.event, params.callback);
    },
    removeEvent: function(label) {
        for(i = 0; i < this.allEvents.length; i++) {
            let event = eventHandler.allEvents[i];
            if(event.label === label) {
                event.div.removeEventListener(event.event, event.callback);
                this.allEvents.splice(i, 1);
            }
        }
    },
    removeAllEvents: function() {
        for(i = 0; i < this.allEvents.length; i++) {
            let event = eventHandler.allEvents[i];
            event.div.removeEventListener(event.event, event.callback);
        }
        this.allEvents = [];
    }
}