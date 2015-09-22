Template.notifications.helpers({
	notifications: function() {

		return Alerts.find({messageTo: Meteor.userId()})


		//return Alerts.find();
	}
})


Template.notifications.events({ 
    'click .show-message': function() {
        ShowNotificationMessage(this.message);
     }
})

function ShowNotificationMessage(strMessage)
{
	IonPopup.show({
		title: 'Alert',
		template: '<div class="center">'+strMessage+'</div>',
		buttons: 
		[{
			text: 'OK',
			type: 'button-positive',
			onTap: function() {
				IonPopup.close();
			}
		}]
	});
}