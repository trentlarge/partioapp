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
				Meteor.logout();
			},
			onCancel: function() {
				console.log('Cancelled');
			}
		});
	}
})