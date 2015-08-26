Push.debug = true;

Router.configure({
 layoutTemplate: 'appLayout'
});

Router.route('/', { name: 'main' });
Router.route('/venmo_oath', {
	where: 'server'
}).get(function() {
	console.log(this.request.query);
	if (this.request.query.venmo_challenge) {
		this.response.statusCode = 200;
		this.response.end(this.request.query.venmo_challenge);
	} else {
	var thisUserCode = this.request.query.code;
	var thisVenmoUser = this.request.query.state;
	Meteor.call('venmoVerification', thisUserCode, thisVenmoUser);
	}
});

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

Router.route('/stripeAccount', {name: 'stripeAccount'});

Router.onBeforeAction(loginChecker);
Router.onAfterAction(stopSpinner);

function loginChecker() {
	// if (Meteor.isClient && Meteor.userId()) {
	if (Meteor.userId()) {
		this.next();		
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