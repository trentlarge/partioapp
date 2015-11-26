Template.notifications.events({
    'click .show-message': function(e, t) {
    	e.preventDefault();

        console.log(this);

    	switch(this.type) {
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
