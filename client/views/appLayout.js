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

    Alerts = new Meteor.Collection(null);

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
		var query1 = Connections.find({"bookData.ownerId": Meteor.userId()});
		var query2 = Connections.find({"requestor": Meteor.userId(), "state": "PAYMENT"});

		// query1.observeChanges({
		// 	added: function(id, fields) {
		// 		console.log(fields);

		// 		if (!Alerts.findOne({connectionId: id, unread: true})) {
		// 			var currentOne = Alerts.insert({
		// 				connectionId: id,
		// 				type: "request",
		// 				unread: true
		// 			})
					
		// 			IonPopup.show({
		// 				title: 'Alert',
		// 				template: '<div class="center">You got a new book request</div>',
		// 				buttons: 
		// 				[{
		// 					text: 'OK',
		// 					type: 'button-positive',
		// 					onTap: function() {
		// 						IonPopup.close();
		// 						Meteor.setTimeout(function(){
		// 							Alerts.update({_id: currentOne}, {$set: {unread: false}})
		// 							Router.go('inventory');
		// 						},1000)
		// 					}
		// 				}]
		// 			});

		// 		}

		// 	}
		// });

		// query2.observeChanges({
		// 	added: function(id, fields) {
		// 		console.log(fields);

		// 		if (!Alerts.findOne({connectionId: id, unread: true})) {
		// 			var currentOne = Alerts.insert({
		// 				connectionId: id,
		// 				type: "approval",
		// 				unread: true
		// 			})
					
		// 			IonPopup.show({
		// 				title: 'Alert',
		// 				template: '<div class="center">Your request is approved</div>',
		// 				buttons: 
		// 				[{
		// 					text: 'OK',
		// 					type: 'button-positive',
		// 					onTap: function() {
		// 						IonPopup.close();
		// 						Meteor.setTimeout(function(){
		// 							Alerts.update({_id: currentOne}, {$set: {unread: false}})
		// 							Router.go('renting');
		// 						},1000)
		// 					}
		// 				}]
		// 			});

		// 		}
		// 	}
		// })

	});
}









