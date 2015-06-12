if (Meteor.isCordova) {
	cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);	
}

Template.main.events({
	// 'click .top-part': function() {
	// 	console.log('top part');
	// 	Router.go('/lend');
	// },
	'click .bottom-part': function() {
		console.log('bottom-part');
		Router.go('/borrow');
	}
});

Template.appLayout.events({
	'click #logout': function() {
		Meteor.logout();
	}
})