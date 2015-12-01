Template.main.events({
	'click .bottom-part': function() {
		console.log('bottom-part');
    Session.set('searchText', '');
		Router.go('/listing');
	},

	'click .top-part': function(event){
    Router.go('/lend');
	}
});
