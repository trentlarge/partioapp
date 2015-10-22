Push.debug = true;


//if (Meteor.isCordova) {

Router.configure({
	layoutTemplate: 'appLayout'
});

Router.route('/', { name: 'main' });
Router.route('/verify-email/:token', {name: 'emailverification'});
Router.route('/reset-password/:token', {name: 'resetpassword'});

Router.route('/login', {
	name: 'login',
	loadingTemplate: 'loadingTemplate',
	waitOn:function(){
		Accounts.loginServicesConfigured();
	}
});
Router.route('/lend', {name: 'lend' });
Router.route('/inventory', {name: 'inventory'});
Router.route('/inventory/:_id', {
	name: 'inventoryDetail',
	data: function() {
		return Products.findOne({_id: this.params._id});
	}
});
Router.route('/inventory/connect/:_id', {
	name: 'connect',
	data: function() {
		return Connections.findOne({_id: this.params._id});
	}
});
Router.route('/renting', {name: 'renting'});

Router.route('/renting/connect/:_id', {
	name: 'connectRent',
	data: function() {
		return Connections.findOne({_id: this.params._id});
	}
});

Router.route('/chat/:_id', {
	name: 'chat',
	data: function() {
		return Connections.findOne({_id: this.params._id});
	}
});

Router.route('/listing', {name: 'listing'});

Router.route('/listing/search/:_id', {
	name: 'search',
	data: function() {
		return this.params;
		// var ean = Search.findOne(this.params._id).ean;
		// return Products.find({"ean": ean});
	}
});

Router.route('/listing/:_id', {
	name: 'bookDetail',
	data: function() {
		return Products.findOne({_id: this.params._id});
	}
});
Router.route('/transactions', {name: 'transactions'});
Router.route('/profile', {name: 'profile'})
Router.route('/profile/savedcards', {name: 'savedCards'});
Router.route('/profile/bankaccount', {name: 'bankAccount'});

Router.route('/stripeAccount', {name: 'stripeAccount'});

Router.route('/notifications', {name: 'notifications'});

Router.onBeforeAction(loginChecker, {except: ['emailverification']} );
Router.onAfterAction(stopSpinner);

function loginChecker() {
	// if (Meteor.isClient && Meteor.userId()) {
		if (Meteor.userId()) {
			if (Meteor.user().emails && Meteor.user().emails[0].verified) {
				this.next();
			} else {
				this.render('profile');
			}
		} else {
			if (Meteor.loggingIn()) {
				IonLoading.show();
			} else {
				this.render('login');
			}
		}
}

function stopSpinner() {
	IonLoading.hide();
}

//}
