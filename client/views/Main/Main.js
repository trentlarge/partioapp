Template.main.events({
	'click .bottom-part': function() {
        Session.set('searchText', '');
		Router.go('/listing');
	},

	'click .top-part': function(event){
    	Router.go('/lend');
	},
});


Template.main.rendered = function(){
	var _user = Meteor.user();
	var birthDate = false;
	var mobile = false;
	
	if(_user.profile.birthDate) {
		if(_user.profile.birthDate != '') {
			birthDate = true;
		}
	}

	if(_user.private.mobile) {
		if(_user.private.mobile != '') {
			mobile = true;
		}
	}

	//need to update fields
	if(( !mobile || !birthDate ) && _user.private.viewTutorial) {
		Meteor.call('checkProfileFields', function(err, check){
			if(!check) {
				IonModal.open('updateProfile');
			}
		})
	}

	Meteor.call('checkFriendShareCode');

}
