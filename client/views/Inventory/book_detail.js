Template.bookDetail.helpers({
	owner: function() {
		var user = Meteor.users.findOne(this.userId);
		if(!user) {
			return ""
		}
		return user.profile.name;
	},
	noProfileYet: function() {
		var owner = Meteor.users.findOne(this.ownerId);
		if(!owner) {
			return true;
		}
		if (owner.profile.avatar === "notSet") {
			return true;
		} else {
			return false;
		}
	},
	profileImage: function() {
		var owner = Meteor.users.findOne(this.ownerId);
		if(!owner) {
			return "";
		}
		return owner.profile.avatar;
	},
	userInfo: function() {
		var owner = Meteor.users.findOne(this.ownerId);
		if(!owner) {
			return {};
		}
		return owner.profile;
	},
	manualEntry: function() {
		return (this.manualEntry) ? true : false;
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
					type: 'button-energized',
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
					type: 'button-energized',
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
					PartioLoad.show();
					Meteor.call('requestOwner', Meteor.userId(), productId, function(error, result) {
						if (!error) {
							PartioLoad.hide();
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
							PartioLoad.hide();
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
