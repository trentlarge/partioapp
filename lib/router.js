Router.configure({
	layoutTemplate: 'appLayout'
});

// !!!
// Temporary solution - subscribe to all data until we move subscriptions to route controllers
// 
Router.waitOn(function() {
  Meteor.subscribe('connections');
  Meteor.subscribe('notifications');
  Meteor.subscribe('products');
  Meteor.subscribe('search');
  Meteor.subscribe('searchcamfind');
  Meteor.subscribe('transactions');
  // following line is super unsecure and will be removed soon
  Meteor.subscribe('all_users');
});
//
// !!!

Router.route('/', { name: 'main', controller: 'MainController' });
Router.route('/verify-email/:token', { name: 'emailverification', controller: 'EmailVerificationController' });
Router.route('/reset-password/:token', { name: 'resetpassword', controller: 'ResetPasswordController' });
Router.route('/login', { name: 'login', controller: 'LoginController' });
Router.route('/register', {name: 'register', controller: 'RegisterController', loadingTemplate: 'register' });
Router.route('/lend', { name: 'lend', controller: 'LendController' });
Router.route('/inventory', { name: 'inventory', controller: 'InventoryController' });
Router.route('/inventory/:_id', { name: 'inventoryDetail', controller: 'InventoryDetailController' });
Router.route('/inventory/connect/:_id', { name: 'connect', controller: 'ConnectController' });
Router.route('/renting', { name: 'renting', controller: 'RentingController' });
Router.route('/renting/connect/:_id', { name: 'connectRent', controller: 'ConnectRentController' });
Router.route('/chat/:_id', { name: 'chat', controller: 'ChatController' });
Router.route('/listing', { name: 'listing', controller: 'ListingController' });
Router.route('/listing/search/:_id', { name: 'search', controller: 'SearchController' });
Router.route('/listing/:_id', { name: 'bookDetail', controller: 'BookDetailController' });
Router.route('/transactions', { name: 'transactions', controller: 'TransactionsController' });
Router.route('/profile', { name: 'profile', controller: 'ProfileController' });
Router.route('/profile/savedcards', { name: 'savedCards', controller: 'SavedCardsController' });
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

// !!! non existing routes
//Router.route('/profile/bankaccount', { name: 'bankAccount', controller: 'BankAccountController' });
//Router.route('/stripeAccount', { name: 'stripeAccount', controller: 'StripeAccountController' });
// !!!

Router.onBeforeAction(loginChecker, { except: ['emailverification', 'register', 'login'] } );
Router.onAfterAction(stopSpinner);

function loginChecker() {
	if (Meteor.userId()) {
		if (Meteor.user() && Meteor.user().emails && Meteor.user().emails[0].verified) {
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
	IonLoading.hide();
}
