
UI.registerHelper('root_url', function(){
  return __meteor_runtime_config__.ROOT_URL.slice(0,-1);
});

UI.registerHelper('getImage', function(image){
  return base64imgs(image);
});

UI.registerHelper('getLoadingImage', function(){
  var image = Random.choice(['loading1', 'loading2', 'loading3', 'loading4']);
  console.log(image);
  return base64imgs(image);
});

UI.registerHelper('getTutorialImage', function(image){
  return base64imgsTutorial(image);
});

UI.registerHelper('getVersion', function(){
  return Meteor.settings.public.appVersion;
});

UI.registerHelper('getUserLocation', function(location){
  return areaName(location);
});

Template.appLayout.events({
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

				var _user = Meteor.user();

				if(_user){
					if(_user.emails) {
						if(!_user.emails[0].verified){
							return false;
						} else {
							return true;
						}
					} else {
						return false;
					}
				} else {
					return false;
				}

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
			case 'Tutorial':
				return false;
				break;
			default:
				return true;
		}
	},

	isFullscreen: function(){
		var mainTemplateName = Router.current()._layout._regions.main._template;
		switch (mainTemplateName) {
			case 'Login':
				return true;
				break;
			case 'loadingData':
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
  Stripe.setPublishableKey(Meteor.settings.public.STRIPE_PUBKEY);

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

function ShowRequestPopUp(strProductName){

	if(IsPopUpOpen){
		//PopUp is open already, no need for a new one.
		return;
	}

	IsPopUpOpen = true;
	IonPopup.show({
		title: 'Alert',
		template: 'You got a new book request for ' + strProductName,
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
		template: 'Your request for ' + strProductName + ' has been approved.',
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
						Router.go('/items');
					}

				},1000)
			}
		}]
	});
}

function ShowPaymentPopUp(productNameString, paymentAmountInt) {
	if(IsPopUpOpen){
		//PopUp is open already, no need for a new one.
		return;
	}

	IsPopUpOpen = true;

	IonPopup.show({
		title: 'Alert',
		template: 'You have received a payment of $'+ paymentAmountInt +' for '+ productNameString,
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

function ShowRequestDeniedPopUp(productName){
	if(IsPopUpOpen){
		//PopUp is open already, no need for a new one.
		return;
	}

	IsPopUpOpen = true;

	IonPopup.show({
		title: 'Alert',
		template: 'Your request for - '+productName+' - has been denied! :( Shall we throw the owner to the lions?!',
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
