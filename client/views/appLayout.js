
UI.registerHelper('root_url', function(){
  return __meteor_runtime_config__.ROOT_URL.slice(0,-1);
});

UI.registerHelper('getImage', function(image){
	return "data:image/png;base64,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";
//  return base64imgs(image);
});

Template.appLayout.rendered = function() {
	Meteor.subscribe("myConnectionsOwner");
	Meteor.subscribe("myConnectionsRequestor");
	Meteor.subscribe("myNotificationsReceived");
}

Template.appLayout.events({
	'click #editCurrent': function() {
		Session.set('editMode', true);
	},

	'click .backFromEdit': function() {
		Session.set('editMode', false);
	},

	'change #payToggle': function(event) {
		Session.set('testPay', event.target.checked);
	}
});

Template.appLayout.helpers({
	showSideMenu: function(){
		var mainTemplateName = Router.current()._layout._regions.main._template;
        
		switch (mainTemplateName) {
			case 'profile':
				if(!Meteor.user().emails[0].verified){
					return false;
				} else {
					return true;
				}
				break;
			case 'login':
				return false;
				break;
			case 'emailverification':
				return false;
				break;
			case 'Register':
				return false;
				break;
			case 'loadingData':
				return false;
				break;
			default:
				return true;
		}
	},

	isFullscreen: function(){
		var mainTemplateName = Router.current()._layout._regions.main._template;
		switch (mainTemplateName) {
			case 'login':
				return true;
				break;
			default:
				return false;
		}
	}


});

getNewNotifications = function(){
	return Notifications.find({toId: Meteor.userId(), read: false});
}

Template.appLayout.onRendered(function() {

	var _newNotificatons = getNewNotifications();
	_newNotificatons.observeChanges({
		added: function(id, fields) {
			switch(fields.type) {

				case "request": {
					sAlert.info({
						notificationId: id,
						routeName: "connect",
						routeParams: { _id: fields.connectionId },
						headerMessage: "Alert",
						message: fields.message
					});
				}; break;

				case "approved": {
					sAlert.info({
						notificationId: id,
						routeName: "connectRent",
						routeParams: { _id: fields.connectionId },
						headerMessage: "Alert",
						message: fields.message
					});
				}; break;

				case "declined": {

					sAlert.info({
						notificationId: id,
						routeName: "connectRent",
						routeParams: { _id: fields.connectionId },
						headerMessage: "Alert",
						message: fields.message
					});
				}; break;

				case "chat": {
					if (Iron.Location.get().path !== '/talk/' + id ) {
						sAlert.info({
							routeName: "talk",
							routeParams: { _id: fields.connectionId },
							headerMessage: "New message",
							message: fields.message
						});
					}
				}; break;

				default: {
					IonLoading.show({
						duration: 2000,
						customTemplate: '<div class="center"><h5>'+ fields.message 	+'</h5></div>',
					});
					Meteor.call("markNotificationRead", id, function(err, res) {
						if(err) {
							var errorMessage = err.reason || err.message;
							if(err.details) {
								errorMessage = errorMessage + "\nDetails:\n" + err.details;
							}
							sAlert.error(errorMessage);
							return;
						}
					});
				}
			}

		}
	});
});


Template.registerHelper('cleanDate', function() {
	return moment(this.timestamp).fromNow();
});

Template.registerHelper('profilePic', function(avatar) {
	return (avatar === "notSet") ? "/profile_image_placeholder.jpg" : avatar;
})

Template.sAlertCustom.events({
	'click .whichalert': function() {
		if(this.notificationId) {
			Meteor.call("markNotificationRead", this.notificationId, function(err, res) {
				if(err) {
					var errorMessage = err.reason || err.message;
					if(err.details) {
						errorMessage = errorMessage + "\nDetails:\n" + err.details;
					}
					sAlert.error(errorMessage);
					return;
				}
			});
		}
		if(this.routeName) {
			Router.go(this.routeName, this.routeParams);
		}
	},
	'click .s-alert-close': function(e) {
		e.stopPropagation();
	}
})

Meteor.startup(function() {
//  Stripe.setPublishableKey(Meteor.settings.public.STRIPE_PUBKEY);

  GoogleMaps.load({
  	key: 'AIzaSyDMyxBlvIc4b4hoWqTw4lGr5OviU8FlQc8',
  	libraries: 'places'
  });

  sAlert.config({
    effect: 'jelly',
    position: 'top',
    timeout: 6000,
    html: false,
    onRouteClose: true,
    stack: {
        spacing: 1, // in px
        limit: 3 // when fourth alert appears all previous ones are cleared
    },
    offset: 0, // in px - will be added to first alert (bottom or top - depends of the position in config)
    beep: '/audio/alert.mp3'  // or you can pass an object:
  });

});


//CREATING a local collection for Chat

var IsPopUpOpen;

function ShowRequestPopUp(strBookName){

	if(IsPopUpOpen){
		//PopUp is open already, no need for a new one.
		return;
	}

	IsPopUpOpen = true;
	IonPopup.show({
		title: 'Alert',
		template: '<div class="center">You got a new book request for '+strBookName+'</div>',
		buttons:
		[{
			text: 'OK',
			type: 'button-energized',
			onTap: function() {
				IonPopup.close();
				IsPopUpOpen = false;
				Meteor.setTimeout(function(){
					var currentPage = Iron.Location.get().path;

					if(currentPage.indexOf("inventory")>=0)
					{
					    //do something you want
					}
					else
					{
						Router.go('inventory');
					}


				}, 1000)
			}
		}]
	});
}

function RandomPopup(){
	IsPopUpOpen = true;

	IonPopup.show({
		title: 'Alert',
		template: '<div class="center">Random Kingdom</div>',
		buttons:
		[{
			text: 'OK',
			type: 'button-energized',
			onTap: function() {
				IsPopUpOpen = false;

				IonPopup.close();
			}
		}]
	});
}

function ShowApprovalPopUp(strBookName){
	if(IsPopUpOpen){
		//PopUp is open already, no need for a new one.
		return;
	}

	IsPopUpOpen = true;

	IonPopup.show({
		title: 'Alert',
		template: '<div class="center">Your request for ' + strBookName + ' has been approved.</div>',
		buttons:
		[{
			text: 'OK',
			type: 'button-energized',
			onTap: function() {
				IonPopup.close();
				Meteor.setTimeout(function(){
					var currentPage = Iron.Location.get().path;
					if(currentPage.indexOf("renting")>=0) {
					    //do something you want
					} else {
						Router.go('/renting');
					}

				},1000)
			}
		}]
	});
}

function ShowPaymentPopUp(bookNameString, paymentAmountInt) {
	if(IsPopUpOpen){
		//PopUp is open already, no need for a new one.
		return;
	}

	IsPopUpOpen = true;

	IonPopup.show({
		title: 'Alert',
		template: '<div class="center">You have received a payment of $'+ paymentAmountInt +' for '+ bookNameString +'</div>',
		buttons:
		[{
			text: 'OK',
			type: 'button-energized',
			onTap: function() {
				IonPopup.close();
				Meteor.setTimeout(function(){

				},1000)
			}
		}]
	});
}

function ShowRequestDeniedPopUp(bookName){
	if(IsPopUpOpen){
		//PopUp is open already, no need for a new one.
		return;
	}

	IsPopUpOpen = true;

	IonPopup.show({
		title: 'Alert',
		template: '<div class="center">Your request for - '+bookName+' - has been denied! :( Shall we throw the owner to the lions?!</div>',
		buttons:
		[{
			text: 'OK',
			type: 'button-energized',
			onTap: function() {
				IonPopup.close();
				Meteor.setTimeout(function(){

				},1000)
			}
		}]
	});
}
