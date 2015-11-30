
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
		console.log("toggling!");
		Session.set('testPay', event.target.checked);
	},

	'click #cancelProfile': function() {
    Router.go('/');
  },

  'click #saveProfile': function() {
    PartioLoad.show();

    var updatedProfile = {
      "name": $('#profilename').val(),
      "college": $('#profileuniversity').val(),
      "mobile": $('#profilemobile').val()
    }
    console.log(updatedProfile);
    Meteor.users.update({"_id": Meteor.userId()}, {$set: {"profile.name": updatedProfile.name,"profile.mobile": updatedProfile.mobile, "profile.college": updatedProfile.college}}, function(error) {
      if (!error) {
        PartioLoad.hide();
        console.log("success!");
        Session.set('profileEdit', false);
      }
    });
  }
	// 'click #logout': function() {
	// 	IonPopup.confirm({
	// 	  okText: 'Logout',
	// 	  cancelText: 'Cancel',
	// 	  title: 'Logging out',
	// 	  template: '<div class="center">Are you sure you want to logout?</div>',
	// 	  onOk: function() {
	// 	    Router.go('/login')
	// 	    Meteor.logout();
	// 	    IonPopup.close();
	// 	  },
	// 	  onCancel: function() {
	// 	    console.log('Cancelled');
	// 	    IonPopup.close();
	// 	  }
	// 	});
	// }
});

Template.appLayout.helpers({
	showSideMenu: function(){
		//var mainTemplateName = Router.current().route.getName();
		var mainTemplateName = Router.current()._layout._regions.main._template;
//		console.log(mainTemplateName);

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
					if(IsPopUpOpen){
						//PopUp is open already, no need for a new one.
						return;
					}

					IsPopUpOpen = true;

					IonPopup.show({
						title: 'Alert',
						template: '<div class="center">'+ fields.message +'</div>',
						buttons:
						[{
							text: 'OK',
							type: 'button-energized',
							onTap: function() {
								IsPopUpOpen = false;
								IonPopup.close();
								Meteor.setTimeout(function(){
									Router.go('/inventory');
									Notifications.update({_id: id}, {$set: {read: true}});
									Session.set('alertCount', Session.get('alertCount') + 1);
								},500)
							}
						}]
					});
				}; break;

				case "approved": {
					if(IsPopUpOpen){
						//PopUp is open already, no need for a new one.
						return;
					}

					IsPopUpOpen = true;

					IonPopup.show({
						title: 'Alert',
						template: '<div class="center">'+ fields.message +'</div>',
						buttons:
						[{
							text: 'OK',
							type: 'button-energized',
							onTap: function() {
								IsPopUpOpen = false;

								IonPopup.close();
								Meteor.setTimeout(function(){
									Router.go('/renting');
									Notifications.update({_id: id}, {$set: {read: true}});
									Session.set('alertCount', Session.get('alertCount') + 1);
								},500)
							}
						}]
					});
				}; break;

				case "declined": {

					if(IsPopUpOpen) {
						//PopUp is open already, no need for a new one.
						return;
					}

					IsPopUpOpen = true;

					IonPopup.show({
						title: 'Alert',
						template: '<div class="center">'+ fields.message +'</div>',
						buttons:
						[{
							text: 'OK',
							type: 'button-energized',
							onTap: function() {
								IsPopUpOpen = false;
								IonPopup.close();
								Meteor.setTimeout(function(){
									Router.go('/renting');
									Notifications.update({_id: id}, {$set: {read: true}});
									Session.set('alertCount', Session.get('alertCount') + 1);
									//MainController
								},500)
							}
						}]
					});
				}; break;

				case "chat": {
					console.log(id, fields);

				 		if (Iron.Location.get().path !== '/chat/' + id ) {
				 			sAlert.info({
				 				goToChat: '/talk/' + fields.connectionId,
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
					Session.set('alertCount', Session.get('alertCount') + 1);
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
		Router.go(this.goToChat)
	},
	'click .s-alert-close': function(e) {
		e.stopPropagation();
	}
})

Meteor.startup(function() {
  Stripe.setPublishableKey(Meteor.settings.STRIPE_PUBKEY);

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

Session.set('alertCount', 0);

//CREATING a local collection for Chat

var IsPopUpOpen;

function ShowRequestPopUp(strBookName){
	console.log('IsPopUpOpen: ' + IsPopUpOpen);

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
