Template.bookDetail.helpers({
	owner: function() {
		return Meteor.users.findOne(this.userId).profile.name;
	},
	noProfileYet: function() {
		if (Meteor.users.findOne(this.ownerId).profile.avatar === "notSet") {
			return true;
		} else {
			return false;
		}
	},
	profileImage: function() {
		return Meteor.users.findOne(this.ownerId).profile.avatar;
	},
	userInfo: function() {
		return Meteor.users.findOne(this.ownerId).profile;
	},
	bookResult: function() {
		return (this.category === "Book") ? true : false;
	}
});

Template.bookDetail.events({
	'click #requestBook': function() {
		console.log('requesting book...');
		var productId = this._id;

		if (this.ownerId === Meteor.userId()) {
			IonPopup.show({
				title: 'You own this item! :)',
				template: '',
				buttons: 
				[{
					text: 'OK',
					type: 'button-positive',
					onTap: function() {
						IonPopup.close();
					}
				}]
			});
		} else if ( Connections.findOne({"bookData._id": this._id}) && (Meteor.userId() === Connections.findOne({"bookData._id": this._id}).requestor)) {
			IonPopup.show({
				title: 'You already borrowed this item!',
				template: '',
				buttons: 
				[{
					text: 'OK',
					type: 'button-positive',
					onTap: function() {
						IonPopup.close();
					}
				}]
			});
		} else {
			IonPopup.confirm({
				okText: 'Proceed',
				cancelText: 'Cancel',
				title: 'Continuing will send a request to the book Owner',
				template: '<div class="center">You\'ll receive a notification once the owner accepts your request</div>',
				onOk: function() {
					console.log("proceeding with connection");
					IonLoading.show();
					Meteor.call('requestOwner', Meteor.userId(), productId, function(error, result) {
						if (!error) {
							IonLoading.hide();
							console.log(result);
							IonLoading.show({
								duration: 2000,
								delay: 400,
								customTemplate: '<div class="center"><h5>Request Sent</h5></div>',
							});
							Meteor.setTimeout(function() {
								Router.go('/booksLent');
							}, 2500)
						} else {
							IonLoading.hide();
							console.log(error);
						}
					})
				},
				onCancel: function() {
					console.log('Cancelled');
				}
			});
		}

		
	}
})





