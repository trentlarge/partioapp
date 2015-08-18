Router.configure({
 layoutTemplate: 'appLayout'
});

// if (Meteor.isCordova) {
	Router.route('/', { name: 'main' });
// } else {
// 	Router.route('/', {where: 'server'}).get(function() {
// 		this.response.writeHead(302, {
// 			'Location': "http://www.parti-o.com"
// 		});
// 		this.response.end();
// 	});
// }

// Router.route('/payment', {where: 'server'}).get(function() {
// 		console.log(this.request.query)
// 		this.response.statusCode = 200;
// 		this.response.end(this.request.query.venmo_challenge);
// 		return this.request.query.venmo_challenge;
// 		});
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

// Router.route('/venmo_oath', {
// 	name: ''
// })

// if (Meteor.isCordova) {

Router.route('/login', { 
	name: 'login',
	loadingTemplate: 'loadingTemplate',
	waitOn:function(){
		Accounts.loginServicesConfigured();
	}
});
Router.route('/lend', {name: 'lend' });
Router.route('/mybooks', {name: 'mybooks'});
Router.route('/mybooks/:_id', {
	name: 'mybookDetail',
	data: function() {
		return Products.findOne({_id: this.params._id});
	}
});
Router.route('/mybooks/connect/:_id', {
	name: 'connect',
	data: function() {
		return Connections.findOne({_id: this.params._id});
	}
});
Router.route('/booksLent', {name: 'booksLent'});

Router.route('/booksLent/connect/:_id', {
	name: 'connectRent',
	data: function() {
		return Connections.findOne({_id: this.params._id});
	}
});
Router.route('/listing', {name: 'listing'});
Router.route('/listing/:_id', {
	name: 'bookDetail',
	data: function() {
		return Products.findOne({_id: this.params._id});
	}
});
Router.route('/transactions', {name: 'transactions'});
Router.route('/profile', {name: 'profile'})
// Router.route('/:venmo', {
// 	name: 'venmoAuth',
// 	action: function() {
// 		if (this.params.query.code) {
// 			var venmoCode = this.params.query.code;
// 			var thisUserId = this.params.query.state;
// 			console.log(venmoCode +', '+ thisUserId);
// 			Meteor.call('venmoVerification', venmoCode, thisUserId);
// 		}
// 		this.render();
// 	}
// });
Router.route('/stripeAccount', {name: 'stripeAccount'});

// Router.onBeforeAction(loginChecker);
// Router.onAfterAction(stopSpinner);
// }

function loginChecker() {
	if (this.userId()) {  //THIS IS THE BOOTHU! Error: Meteor.userId can only be invoked in method calls. Use this.userId in publish functions
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