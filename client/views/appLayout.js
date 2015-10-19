Template.main.events({
	'click .bottom-part': function() {
		console.log('bottom-part');
		Router.go('/listing');
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



Meteor.startup(function() {

    Stripe.setPublishableKey('pk_test_OYfO9mHIQFha7How6lNpwUiQ');

    GoogleMaps.load({
    	key: 'AIzaSyDMyxBlvIc4b4hoWqTw4lGr5OviU8FlQc8',
    	libraries: 'places'
    });

    sAlert.config({
        effect: 'jelly',
        position: 'bottom',
        timeout: 10000,
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
					if (item.sender !== Meteor.userId && !Chat.findOne({connectionId: id, timestamp: item.timestamp})) {
						Chat.insert({
							connectionId: id,
							message: item.message,
							state: "new",
							timestamp: item.timestamp
						})
					}
				})
				if (Iron.Location.get().path !== '/chat/' + id ) {
					sAlert.info({goToChat: '/chat/' + id, message: Chat.find({connectionId: id, state: "new"}).count() + ' New chat message(s)'});
				}
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

// Template.appLayout.rendered = function() {
// 	var self = this;

// 	self.autorun(function() {
// 		var query1 = Connections.find({"bookData.ownerId": Meteor.userId(),
// 										"state": "WAITING"});

// 		var query2 = Connections.find({"requestor": Meteor.userId(), "state": "PAYMENT"});

// 		var query4 = Connections.find({"requestor": Meteor.userId(), "state": "DENIED"});
		
// 		var query3 = Connections.find({"bookData.ownerId": Meteor.userId(),
// 										"state": "IN USE"});

		
// 		query1.observeChanges({
// 			added: function(id, fields) {
// 				console.log(fields);

// 				var connectionObj = Connections.findOne({"_id": id});
// 				var bookOwnerID = connectionObj.bookData.ownerId;
// 				var borrowerID = connectionObj.requestor;

// 				console.log('bookOwnerID: '+ bookOwnerID);
// 				console.log('borrowerID: '+ borrowerID);

// 				var connectionBookName = connectionObj.bookData.title;

// 				if (!Alerts.findOne({connectionId: id, unread: true})) 
// 				{
// 					var currentOne = Alerts.insert({
// 						connectionId: id,
// 						_id: id,
// 						bookOwner: bookOwnerID,
// 						borrower: borrowerID,
// 						messageTo: bookOwnerID,
// 						type: "request",
// 						message:'You have a book request for ' + connectionBookName,
// 						unread: true
// 					})
					
// 					console.log('currentOne: ' + currentOne);
// 					console.log('connectionId: ' + id);

// 					ShowRequestPopUp(connectionBookName);
// 				}

// 			}
// 		});

// 		query2.observeChanges({
// 				added: function(id, fields) {
					
// 					console.log('query2:' + JSON.stringify(id));
					
// 					var alertObj = Alerts.findOne({connectionId: id, unread: true});
// 					console.log('query2 alertObj:' + alertObj);

// 					var connectionObj = Connections.findOne({"_id": id});
// 					var connectionBookName = connectionObj.bookData.title;
// 					var bookOwnerID = connectionObj.bookData.ownerId;
// 					var borrowerID = connectionObj.requestor;

// 					if (alertObj) 
// 					{
// 						var currentOne = Alerts.update({
// 							_id: alertObj._id},
// 							{type: "approval",
// 							connectionId: id,
// 							bookOwner: bookOwnerID,
// 							borrower: borrowerID,
// 							messageTo: borrowerID,
// 							message:'Your request for ' + connectionBookName + ' has been approved.',
// 							unread: false}
// 						)
						
// 						ShowApprovalPopUp(connectionBookName);

// 					}
					
// 				}
// 			})

// 			query3.observeChanges({

// 				added: function (id, currentValue) {

// 					console.log('query3:' + JSON.stringify(id));
					
// 					var alertObj = Alerts.findOne({_id: id});
// 					var alertConnection = Alerts.findOne({_id: id, unread: false});

// 					console.log('query3 alertObj:' + alertObj);
// 					console.log('query3 alertConnection:' + alertConnection);

// 					var connectionObj = Connections.findOne({"_id": id});
// 					var connectionBookName = connectionObj.bookData.title;
// 					var connectionPayment = connectionObj.payment;
// 					var connectionPaymentAmount;
// 					var bookOwnerID = connectionObj.bookData.ownerId;
// 					var borrowerID = connectionObj.requestor;

// 					if(connectionPayment)
// 					{
// 						connectionPaymentAmount = parseFloat(connectionPayment.amount, 10);
// 						connectionPaymentAmount = connectionPaymentAmount/100;
// 					}
// 					else
// 					{
// 						connectionPaymentAmount = 0.0;
// 					}

// 					if (!alertObj) 
// 					{
// 						console.log('#3 Alerts.update!');
// 						var currentOne = Alerts.insert(
// 						{
// 							_id: id},
// 							{type: "approval",
// 							connectionId: id,
// 							bookOwner: bookOwnerID,
// 							borrower: borrowerID,
// 							messageTo: bookOwnerID,
// 							message: 'You have received a payment of $'+ connectionPaymentAmount +' for '+ connectionBookName,
// 							unread: false}
// 						)

// 						ShowPaymentPopUp(connectionBookName, connectionPaymentAmount);	
// 					}

					
// 				}
// 			});


// 			query4.observeChanges({

// 				added: function (id, currentValue) {

// 					console.log('query4:' + JSON.stringify(id));
					
// 					var alertObj = Alerts.findOne({connectionId: id});
// 					console.log('query4 alertObj:' + alertObj);

// 					var connectionObj = Connections.findOne({"_id": id});
// 					var connectionBookName = connectionObj.bookData.title;
// 					var bookOwnerID = connectionObj.bookData.ownerId;
// 					var borrowerID = connectionObj.requestor;

					
// 					if (alertObj) 
// 					{
// 						var currentOne = Alerts.insert({
// 							_id: alertObj._id},
// 							{type: "approval",
// 							connectionId: id,
// 							bookOwner: bookOwnerID,
// 							borrower: borrowerID,
// 							messageTo: borrowerID,
// 							message: 'Your request for '+ connectionBookName + ' has been rejected.',
// 							unread: false}
// 						)
						
// 						ShowRequestDeniedPopUp(connectionObj.bookData.title);
// 						Connections.remove({"_id": id});

// 					}

					
// 				}
// 			});
// 	});
	
// }

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




