Template.notifications.helpers({
	'notifications': function() {
		return Notifications.find({toId: Meteor.userId()}, {sort: {timestamp: -1}});
	}
})


Template.notifications.events({ 
    'click .show-message': function() {
        //ShowNotificationMessage(this.message);
        Router.go(this.router);
     }
});

Template.notifications.onRendered(function() {
	Session.set('alertCount', 0);
})

function ShowNotificationMessage(strMessage)
{
	IonPopup.show({
		title: 'Alert',
		template: '<div class="center">'+strMessage+'</div>',
		buttons: 
		[{
			text: 'OK',
			type: 'button-energized',
			onTap: function() {
				IonPopup.close();
			}
		}]
	});
}