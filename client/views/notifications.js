Template.notifications.helpers({
	notifications: function() {

		return Alerts.find({ $or: [{ messageTo: Meteor.userId() }, 
			{ messageTo : Meteor.userId() } ] })


		//return Alerts.find();
	}
})


Template.notifications.events({ 
    'click #showMessage': function() {
             console.log( this )
        var AlertsObj = Alerts.find("_id":this._id);
        ShowNotificationMessage(AlertsObj.message);
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
				Meteor.setTimeout(function(){

				},1000)
			}
		}]
	});
}