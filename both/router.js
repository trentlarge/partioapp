Router.configure({ layoutTemplate: 'appLayout' });


Router.route('/', { name: 'main' });
Router.route('/login', { name: 'login' });

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