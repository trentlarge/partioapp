Router.configure({ layoutTemplate: 'appLayout' });

Router.route('/', { name: 'main' });
Router.route('/login', { 
	name: 'login',
	waitOn:function(){
		Accounts.loginServicesConfigured();
	}
});
Router.route('/borrow', {name: 'borrow' });
Router.route('/lend', {name: 'lend' });
Router.route('/mybooks', {name: 'mybooks'});
Router.route('/mybooks/:_id', {
	name: 'mybookDetail',
	data: function() {
		return Products.findOne({_id: this.params._id});
	}
});
Router.route('/listing', {name: 'listing'});
Router.route('/listing/:_id', {
	name: 'bookDetail',
	data: function() {
		return Products.findOne({_id: this.params._id});
	}
});

Router.onBeforeAction(loginChecker);
Router.onAfterAction(stopSpinner);

function loginChecker() {
	if (!Meteor.user()) {
		// alert("not meteor.user");
		if (Meteor.loggingIn()) {
			// alert("meter loggin in.. startin chakram");
			IonLoading.show();
			// this.next();
			// alert("after logginIn this.next");
		} else {
			// alert("rendering login, no user found");
			this.render('login');
		}
		
	} else {
		// alert("meteor user present, so logging in");
		this.next();
	}
}

function stopSpinner() {
	IonLoading.hide();
}