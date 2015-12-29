Template.main.events({
	'click .bottom-part': function() {
    Session.set('searchText', '');
		Router.go('/listing');
	},

	'click .top-part': function(event){
    Router.go('/lend');
	}
});
