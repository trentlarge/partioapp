Router.configure({
	layoutTemplate: 'appLayout',
	routeControllerNameConverter: "upperCamelCase"
});

// !!!
// Temporary solution: subscribe to all data before we setup controllers
//
Router.waitOn(function () {
	Meteor.subscribe("connections");
	Meteor.subscribe("notifications");
	Meteor.subscribe("products");
	Meteor.subscribe("search");
	Meteor.subscribe("searchcamfind");
	Meteor.subscribe("transactions");
	Meteor.subscribe("all_users");
});
//
// !!!

//
// route names don't have underscores (e.g. emailverification) so I didn't left router to auto-choose controller name
// because controller name for (example) emailverification will be "EmailverificationController" - that's unreadable
// this is why we have controller name manually set: { ... , controller: "EmailVerificationController" } 
// (which is little bit more readable)
//
Router.route('/', { name: 'main', controller: 'MainController' });
Router.route('/verify-email/:token', {name: 'emailverification', controller: 'EmailVerificationController' });
Router.route('/reset-password/:token', {name: 'resetpassword', controller: 'ResetPasswordController' });
Router.route('/login', { name: 'login', controller: 'LoginController' });
Router.route('/register', {name: 'register', controller: 'RegisterController' });
Router.route('/lend', { name: 'lend', controller: 'LendController' });
Router.route('/inventory', { name: 'inventory', controller: 'InventoryController' });
Router.route('/inventory/:_id', { name: 'inventoryDetail', controller: 'InventoryDetailController' });
Router.route('/inventory/connect/:_id', { name: 'connect', controller: 'ConnectController' });
Router.route('/renting', {name: 'renting', controller: 'RentingController' });
Router.route('/renting/connect/:_id', { name: 'connectRent', controller: 'ConnectRentController' });
Router.route('/chat/:_id', { name: 'chat', controller: 'ChatController' });
Router.route('/categories', { name: 'categories', controller: 'CategoriesController' });
Router.route('/listing', { name: 'listing', controller: 'ListingController' });
Router.route('/listing/search/:_id', { name: 'search', controller: 'SearchController' });
Router.route('/listing/:_id', { name: 'bookDetail', controller: "BookDetailController" });
Router.route('/transactions', { name: 'transactions', controller: 'TransactionsController' });
Router.route('/profile', { name: 'profile', controller: 'ProfileController' });
Router.route('/profile/savedcards', { name: 'savedCards', controller: 'SavedCardsController' });
Router.route('/profile/changepassword', { name: 'changePassword', controller: 'ChangePasswordController' });
Router.route('/notifications', { name: 'notifications', controller: 'NotificationsController' });

Router.route('/logout', {name: 'logout',
	onBeforeAction: function(){
		IonPopup.confirm({
			okText: 'Logout',
		  cancelText: 'Cancel',
		  title: 'Logging out',
		  template: '<div class="center">Are you sure you want to logout?</div>',
		  onOk: function() {
		    Router.go('/login')
		    Meteor.logout();
		    IonPopup.close();
		  },
		  onCancel: function() {
		    console.log('Cancelled');
		    IonPopup.close();
		  }
		});
	}
});

// !!!
// non-existing routes (?)
//
//Router.route('/stripeAccount', { name: 'stripeAccount', controller: 'StripeAccountController' });
//Router.route('/profile/bankaccount', { name: 'bankAccount', controller: 'BankAccountsController' });
//
// !!!

Router.onBeforeAction(loginChecker, {except: ['emailverification', 'register', 'login', 'twilio']} );
Router.onAfterAction(stopSpinner);

function loginChecker() {
	if (Meteor.userId()) {
		if (Meteor.user().emails && Meteor.user().emails[0].verified) {
			this.next()
		} else {
			this.render('profile');
		}
	} else {
		// if (Meteor.loggingIn()) {
		// 	IonLoading.show();
		// } else {
			this.render('login');
		//}
	}
}

function stopSpinner() {
//	IonLoading.hide();
}
