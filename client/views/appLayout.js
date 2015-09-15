Template.main.events({
	'click .bottom-part': function() {
		console.log('bottom-part');
		Router.go('/listing');
	}
});

Template.appLayout.events({
	'click #logout': function() {
		IonPopup.confirm({
			okText: 'Logout',
			cancelText: 'Cancel',
			title: 'Logging out',
			template: '<div class="center">Are you sure you want to logout?</div>',
			onOk: function() {
				Router.go('/')
				Meteor.logout();
			},
			onCancel: function() {
				console.log('Cancelled');
			}
		});
	},
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

Meteor.startup(function() {
    Stripe.setPublishableKey('pk_test_OYfO9mHIQFha7How6lNpwUiQ');

    GoogleMaps.load({
    	key: 'AIzaSyDMyxBlvIc4b4hoWqTw4lGr5OviU8FlQc8',
    	libraries: 'places'
    });

    //Alerts = new Meteor.Collection(null);
});



// Template.appLayout.rendered = function() {
// 	var self = this;

// 	self.autorun(function() {
// 		var query1 = Notifications.find({"userId": Meteor.userId()})

// 		query1.observeChanges({	
// 			changed: function(id,fields) {
// 				console.log(fields);

// 				IonPopup.show({
// 					title: 'Alert',
// 					template: '<div class="center">You got a new book request!</div>',
// 					buttons: 
// 					[{
// 						text: 'OK',
// 						type: 'button-positive',
// 						onTap: function() {
// 							IonPopup.close();
// 							Notifications.update({_id: id, "userId": Meteor.userId(), "alerts.unread": true}, {$set: {"alerts.$.unread": false}})
// 						}
// 					}]
// 				});

// 			}
// 		})
// 	})
// }

Template.appLayout.rendered = function() {
	var self = this;

	self.autorun(function() {
		var query1 = Connections.find({"bookData.ownerId": Meteor.userId(),
										"state": "WAITING"});

		var query2 = Connections.find({"requestor": Meteor.userId(), "state": "PAYMENT"});
		
		var query3 = Connections.find({"bookData.ownerId": Meteor.userId(),
										"state": "IN USE"});

		
		query1.observeChanges({
			added: function(id, fields) {
				console.log(fields);

				if (!Alerts.findOne({connectionId: id, unread: true})) 
				{
					var currentOne = Alerts.insert({
						connectionId: id,
						type: "request",
						unread: true
					})
					
					console.log('currentOne: ' + currentOne);
					console.log('connectionId: ' + id);

					//TEST
					//RandomPopup()
					//TEST

					ShowRequestPopUp();
				}

			}
		});

		query2.observeChanges({
				added: function(id, fields) {
					
					console.log('query2:' + JSON.stringify(id));
					
					var alertObj = Alerts.findOne({connectionId: id, unread: true});
					console.log('query2 alertObj:' + alertObj);

					if (alertObj) 
					{
						var currentOne = Alerts.update({
							_id: alertObj._id},
							{type: "approval",
							unread: false}
						)
						
						ShowApprovalPopUp();

					}
					
				}
			})

			query3.observeChanges({

				added: function (id, currentValue) {

					console.log('query3:' + JSON.stringify(id));
					
					var alertObj = Alerts.findOne({connectionId: id});
					console.log('query3 alertObj:' + alertObj);

					
					if (alertObj.unread) 
					{
						var currentOne = Alerts.update({
							_id: alertObj._id},
							{type: "payment",
							unread: false}
						)
						
						console.log('currentOne: ' + currentOne);
						console.log('connectionId: ' + id);

						//TEST
						//RandomPopup()
						//TEST

						ShowPaymentPopUp();
					}					

				}
			});

		});
}

var IsPopUpOpen;
function ShowRequestPopUp()
{
	if(IsPopUpOpen)
	{
		//PopUp is open already, no need for a new one.
		return;
	}

	IsPopUpOpen = true;
	IonPopup.show({
		title: 'Alert',
		template: '<div class="center">You got a new book request</div>',
		buttons: 
		[{
			text: 'OK',
			type: 'button-positive',
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
			type: 'button-positive',
			onTap: function() {
				IsPopUpOpen = false;

				IonPopup.close();				
			}
		}]
	});
}

function ShowApprovalPopUp()
{
	if(IsPopUpOpen)
	{
		//PopUp is open already, no need for a new one.
		return;
	}

	IsPopUpOpen = true;

	IonPopup.show({
		title: 'Alert',
		template: '<div class="center">Your request is approved</div>',
		buttons: 
		[{
			text: 'OK',
			type: 'button-positive',
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

function ShowPaymentPopUp()
{
	if(IsPopUpOpen)
	{
		//PopUp is open already, no need for a new one.
		return;
	}

	IsPopUpOpen = true;

	IonPopup.show({
		title: 'Alert',
		template: '<div class="center">You have received a payment</div>',
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









