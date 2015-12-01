Template.notifications.events({
    'click .show-message': function(e, t) {
    	e.preventDefault();

        console.log(this);

    	switch(this.type) {
            case "info": {
                switch(this.state) {
                    case "RETURNED": {
//                        if(this.)
                        Router.go("connect", { _id: this.connectionId });
                    }; break;
                }
            }; break;
            case "request": {
                Router.go("connect", { _id: this.connectionId });
            }; break;
            case "approved": {
                Router.go("search", { _id: this.connectionId });
            }; break;
            case "declined": {
                Router.go("search", { _id: this.connectionId });
            }; break;
    		case "chat": {
    			Router.go("talk", { _id: this.connectionId });
    		}; break;
    	}
		return false;
     }
});

Template.notifications.onRendered(function() {
	Session.set('alertCount', 0);
})
