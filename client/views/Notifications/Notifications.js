Template.notifications.events({
    'click .show-message': function(e, t) {
    	e.preventDefault();

    	switch(this.type) {
            case "info": {
                switch(this.state) {
                    case "RETURNED": {
                        // !!!
                        Router.go("connect", { _id: this.connectionId });
                    }; break;
                }
            }; break;
            case "request": {
                Router.go("connect", { _id: this.connectionId });
            }; break;
            case "approved": {
                Router.go("connectRent", { _id: this.connectionId });
            }; break;
            case "declined": {
                Router.go("connectRent", { _id: this.connectionId });
            }; break;
    		case "chat": {
    			Router.go("talk", { _id: this.connectionId });
    		}; break;
    	}
		return false;
     }
});

Template.notifications.onRendered(function() {
    Meteor.call("markAllNotificationsRead", function(err, res) {
console.log("markAllNotificationsRead");
        if(err) {
            var errorMessage = err.reason || err.message;
            if(err.details) {
              errorMessage = errorMessage + "\nDetails:\n" + err.details;
            }
            sAlert.error(errorMessage);
            return;
        }
    });
});
