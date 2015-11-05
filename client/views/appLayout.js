Template.main.events({
	'click .bottom-part': function() {
		console.log('bottom-part');
		Router.go('/listing');
	},

	'click .top-part': function(event){
		CheckStripeAccount();
	}
});

Template.appLayout.helpers({
	'alertCount': function() {
		return Session.get('alertCount');
	}
})

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
	}
});

Template.sAlertCustom.events({
	'click .whichalert': function() {
		Router.go(this.goToChat)
	},
	'click .s-alert-close': function(e) {
		e.stopPropagation();
	}
})

function CheckStripeAccount () {
  if (! Meteor.user().profile.stripeAccount)
  {
    IonLoading.hide();
    IonPopup.show({
      title: 'ATTENTION!',
      template: '<div class="center">A Debit Card should be linked to receive payments for your shared goods!</div>',
      buttons:
      [{
        text: 'Add Card',
        type: 'button-energized',
        onTap: function()
        {
          IonPopup.close();
          $('#closeLend').click();
          Router.go('/profile/savedcards');
          IonModal.close();
        }
      }]
    });

    return false;
  }
  else
  {
    return true;
  }
}

Meteor.startup(function() {

    Stripe.setPublishableKey('pk_test_OYfO9mHIQFha7How6lNpwUiQ');

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

Template.registerHelper('cleanDate', function() {
	return moment(this.timestamp).fromNow();
});

Template.registerHelper('profilePic', function(avatar) {
	return (avatar === "notSet") ? "/profile_image_placeholder.jpg" : avatar;
})

Session.set('alertCount', 0);

//CREATING a local collection for Chat
Chat = new Meteor.Collection(null);

Template.appLayout.onRendered(function() {
	var self = this;

	self.autorun(function() {
		var query1 = Notifications.find({toId: Meteor.userId(), read: false});
		// var query2 = Connections.find({
		// 	$or: [{requestor: Meteor.userId()}, {"bookData.ownerId": Meteor.userId()}],
		// 	"chat.state": "new",
		// 	"chat.sender": {$ne: Meteor.userId()}
		// });

		var chatQuery = Connections.find({ $or: [{requestor: Meteor.userId()}, {"bookData.ownerId": Meteor.userId()}] });

		chatQuery.observeChanges({
			changed: function(id, fields) {
				console.log(id);
				console.log(fields);

				fields.chat.forEach(function(item) {
					if ( (item.sender !== Meteor.userId) && (!Chat.findOne({connectionId: id, timestamp: item.timestamp})) ) {
						Chat.insert({
							connectionId: id,
							message: item.message,
							state: "new",
							timestamp: item.timestamp
						});

						if (Iron.Location.get().path !== '/chat/' + id ) {
							sAlert.info({
								goToChat: '/chat/' + id,
								headerMessage: Meteor.users.findOne(item.sender).profile.name + ':',
								message: item.message
							});
						}
					}
				})

			}
		})

		query1.observeChanges({
			added: function(id, fields) {

				if (fields.type === "request") {

					if(IsPopUpOpen)
					{
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
				} else if (fields.type === "approved") {

					if(IsPopUpOpen)
					{
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
				}
				else if (fields.type === "declined") {

					if(IsPopUpOpen)
					{
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
				} else {
					IonLoading.show({
						duration: 2000,
						customTemplate: '<div class="center"><h5>'+ fields.message 	+'</h5></div>',
					});
					Notifications.update({_id: id}, {$set: {read: true}});
					Session.set('alertCount', Session.get('alertCount') + 1);
				}

			}
		})
	})
})


var IsPopUpOpen;
function ShowRequestPopUp(strBookName)
{
	console.log('IsPopUpOpen: ' + IsPopUpOpen);

	if(IsPopUpOpen)
	{
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

function RandomPopup()
{
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

function ShowApprovalPopUp(strBookName)
{
	if(IsPopUpOpen)
	{
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
					// Alerts.update({_id: currentOne}, {$set: {unread: false}})
					//Router.go('renting');

					var currentPage = Iron.Location.get().path;

					if(currentPage.indexOf("renting")>=0)
					{
					    //do something you want
					}
					else
					{
						Router.go('renting');
					}

				},1000)
			}
		}]
	});
}

function ShowPaymentPopUp(bookNameString, paymentAmountInt)
{
	if(IsPopUpOpen)
	{
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

function ShowRequestDeniedPopUp(bookName)
{
	if(IsPopUpOpen)
	{
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
