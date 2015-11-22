Template.notifications.events({
    'click .show-message': function() {
        //ShowNotificationMessage(this.message);
        Router.go(this.router);
     }
});

Template.notifications.onRendered(function() {
	Session.set('alertCount', 0);
})
