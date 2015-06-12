Router.configure({ layoutTemplate: 'appLayout' });


Router.route('/', { name: 'main' });
Router.route('/login', { name: 'login' });
Router.route('/borrow', {name: 'borrow' });
Router.route('/lend', {name: 'lend' });

Router.onBeforeAction(loginChecker);


function loginChecker() {
	if (!Meteor.user()) {
		if (Meteor.loggingIn()) {
			IonLoading.show();
			this.next();
		} else {
			IonLoading.hide();
			this.render('login');
		}
		
	} else {
		IonLoading.hide();
		this.next();
	}
}