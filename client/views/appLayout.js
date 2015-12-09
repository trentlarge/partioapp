
UI.registerHelper('root_url', function(){
  return __meteor_runtime_config__.ROOT_URL.slice(0,-1);
});

UI.registerHelper('getImage', function(image){
  return base64imgs(image);
});

Template.appLayout.events({
	'click #editCurrent': function() {
		Session.set('editMode', true);
	},

	'click .backFromEdit': function() {
		Session.set('editMode', false);
	},

	'change #payToggle': function(event) {
		Session.set('testPay', event.target.checked);
	},
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
					Notifications.update({_id: id}, {$set: {read: true}});
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
			Notifications.update({ _id: this.notificationId }, { $set: { read: true } });
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
    beep: '/alert.mp3'  // or you can pass an object:
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
					//Alerts.update({connectionId: id}, {$set: {unread: false}})
					var currentPage = Iron.Location.get().path;

					if(currentPage.indexOf("inventory")>=0)
					{
					    //do something you want
					}
					else
					{
						Router.go('inventory');
					}


				},1000)
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
