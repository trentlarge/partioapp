var redirectAndPassConnectionId = function(routeName, connectionId) {
    if(!connectionId) {
        return;
    }

    var connection = Connections.findOne({ _id: connectionId, finished: { $ne: true } });
    if(!connection) {
        return;
    }

    Router.go(routeName, { _id: connectionId });
};

Template.notifications.events({
    'click .show-message': function(e, t) {
    	e.preventDefault();

    	switch(this.type) {
            case "info": {
                switch(this.state) {
                    case "RETURNED": {
                        // !!!
                        redirectAndPassConnectionId("connect", this.connectionId);
                    }; break;
                }
            }; break;
            case "request": {
                redirectAndPassConnectionId("connect", this.connectionId);
            }; break;
            case "approved": {
                redirectAndPassConnectionId("connectRent", this.connectionId);
            }; break;
            case "declined": {
                redirectAndPassConnectionId("connectRent", this.connectionId);
            }; break;
    		case "chat": {
                redirectAndPassConnectionId("talk", this.connectionId);
    		}; break;
    	}
		return false;
     }
});

Template.notifications.onRendered(function() {
    Meteor.call("markAllNotificationsRead", function(err, res) {
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
