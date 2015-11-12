Router.configure({
	layoutTemplate: 'appLayout'
});

Router.route('/', { name: 'main', controller: 'MainController' });
Router.route('/verify-email/:token', {name: 'emailverification', controller: 'EmailVerificationController'});
Router.route('/reset-password/:token', {name: 'resetpassword', controller: 'ResetPasswordController' });
Router.route('/login', { name: 'login', loadingTemplate: 'loadingTemplate', controller: 'LoginController' });
Router.route('/register', {name: 'register', loadingTemplate: 'register', controller: 'RegisterController' });
Router.route('/lend', { name: 'lend', controller: 'LendController' });
Router.route('/inventory', { name: 'inventory', controller: 'InventoryController' });
Router.route('/inventory/:_id', { name: 'inventoryDetail', controller: 'InventoryDetailController' });
Router.route('/inventory/connect/:_id', { name: 'connect', controller: 'ConnectController' });
Router.route('/renting', { name: 'renting', controller: 'RentingController' });
Router.route('/renting/connect/:_id', { name: 'connectRent', controller: 'ConnectRentController' });
Router.route('/chat/:_id', { name: 'chat', controller: 'ChatController' });
Router.route('/categories', {name: 'categories', controller: 'CategoriesController'});
Router.route('/listing', {name: 'listing', controller: 'ListingController'});
Router.route('/listing/search/:_id', { name: 'search', controller: 'SearchController' });
Router.route('/listing/:_id', { name: 'bookDetail', controller: 'BookDetailController' });
Router.route('/transactions', {name: 'transactions', controller: 'TransactionsController'});
Router.route('/profile', {name: 'profile', controller: 'ProfileController'})
Router.route('/profile/savedcards', {name: 'savedCards', controller: 'SavedCardsController'});
//Router.route('/profile/bankaccount', {name: 'bankAccount', controller: 'BankAccountController'});
//Router.route('/stripeAccount', {name: 'stripeAccount', controller: 'StripeAccountController'});
Router.route('/notifications', {name: 'notifications', controller: 'NotificationsController'});
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

if (Meteor.isServer) {
	Router.route('/twilio/:_number', {
		name : 'twilio',
	  where: 'server',
	  action: function() {
			var xmlData = "<Response>";
			xmlData += "<Say voice=\"alice\">Let’s Partio</Say>";
			xmlData += "<Dial record=\"true\">+"+this.params._number.trim()+"</Dial>";
			xmlData += "</Response>";
	    this.response.writeHead(200, {'Content-Type': 'application/xml'});
	    this.response.end(xmlData);
	  }
	});
}

Router.route('/twilio/my_twiml:number', {
  //where: 'server',
  action: function() {

    var xmlData = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
    xmlData += "<Response>";
    xmlData += "<Dial record=\"true\" >"+this.param.number+"</Dial>";
    xmlData += "</Response>";

    this.response.writeHead(200, {'Content-Type': 'application/xml'});
    this.response.end(xmlData);
  }
});


Router.onBeforeAction(loginChecker, {except: ['emailverification', 'register', 'login', 'twilio']} );
Router.onAfterAction(stopSpinner);

function loginChecker() {
	// if (Meteor.isClient && Meteor.userId()) {
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
