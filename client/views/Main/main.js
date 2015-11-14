Template.main.events({
	'click .bottom-part': function() {
		console.log('bottom-part');
        Session.set('searchText', '');
		Router.go('/categories');
	},

	'click .top-part': function(event){
		CheckStripeAccount();

	}
});
