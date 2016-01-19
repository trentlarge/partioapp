logout = function(){
	IonPopup.confirm({
		okText: 'Logout',
		cancelText: 'Cancel',
		title: 'Logging out',
		template: '<div class="center">Are you sure you want to logout?</div>',
		onOk: function() {
			PartioLoad.show('Good Bye!');

			Meteor.logout(function(){
				PartioLoad.hide();
				Router.go('/login')
			});

			IonPopup.close();
		},
		onCancel: function() {
			//console.log('Cancelled');
			IonPopup.close();
		}
	});
}
