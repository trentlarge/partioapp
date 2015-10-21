(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// lib/router.js                                                       //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
Push.debug = true;                                                     // 1
                                                                       //
//if (Meteor.isCordova) {                                              //
                                                                       //
Router.configure({                                                     // 6
	layoutTemplate: 'appLayout'                                           // 7
});                                                                    //
                                                                       //
Router.route('/', { name: 'main' });                                   // 10
Router.route('/verify-email/:token', { name: 'emailverification' });   // 11
Router.route('/reset-password/:token', { name: 'resetpassword' });     // 12
                                                                       //
Router.route('/login', {                                               // 14
	name: 'login',                                                        // 15
	loadingTemplate: 'loadingTemplate',                                   // 16
	waitOn: function () {                                                 // 17
		Accounts.loginServicesConfigured();                                  // 18
	}                                                                     //
});                                                                    //
Router.route('/lend', { name: 'lend' });                               // 21
Router.route('/inventory', { name: 'inventory' });                     // 22
Router.route('/inventory/:_id', {                                      // 23
	name: 'inventoryDetail',                                              // 24
	data: function () {                                                   // 25
		return Products.findOne({ _id: this.params._id });                   // 26
	}                                                                     //
});                                                                    //
Router.route('/inventory/connect/:_id', {                              // 29
	name: 'connect',                                                      // 30
	data: function () {                                                   // 31
		return Connections.findOne({ _id: this.params._id });                // 32
	}                                                                     //
});                                                                    //
Router.route('/renting', { name: 'renting' });                         // 35
                                                                       //
Router.route('/renting/connect/:_id', {                                // 37
	name: 'connectRent',                                                  // 38
	data: function () {                                                   // 39
		return Connections.findOne({ _id: this.params._id });                // 40
	}                                                                     //
});                                                                    //
                                                                       //
Router.route('/chat/:_id', {                                           // 44
	name: 'chat',                                                         // 45
	data: function () {                                                   // 46
		return Connections.findOne({ _id: this.params._id });                // 47
	}                                                                     //
});                                                                    //
                                                                       //
Router.route('/listing', { name: 'listing' });                         // 51
                                                                       //
Router.route('/listing/search/:_id', {                                 // 53
	name: 'search',                                                       // 54
	data: function () {                                                   // 55
		return this.params;                                                  // 56
		// var ean = Search.findOne(this.params._id).ean;                    //
		// return Products.find({"ean": ean});                               //
	}                                                                     //
});                                                                    //
                                                                       //
Router.route('/listing/:_id', {                                        // 62
	name: 'bookDetail',                                                   // 63
	data: function () {                                                   // 64
		return Products.findOne({ _id: this.params._id });                   // 65
	}                                                                     //
});                                                                    //
Router.route('/transactions', { name: 'transactions' });               // 68
Router.route('/profile', { name: 'profile' });                         // 69
Router.route('/profile/savedcards', { name: 'savedCards' });           // 70
Router.route('/profile/bankaccount', { name: 'bankAccount' });         // 71
                                                                       //
Router.route('/stripeAccount', { name: 'stripeAccount' });             // 73
                                                                       //
Router.route('/notifications', { name: 'notifications' });             // 75
                                                                       //
Router.onBeforeAction(loginChecker, { except: ['emailverification'] });
Router.onAfterAction(stopSpinner);                                     // 78
                                                                       //
function loginChecker() {                                              // 80
	// if (Meteor.isClient && Meteor.userId()) {                          //
	if (Meteor.userId()) {                                                // 82
		if (Meteor.user().emails && Meteor.user().emails[0].verified) {      // 83
			this.next();                                                        // 84
		} else {                                                             //
			this.render('profile');                                             // 86
		}                                                                    //
	} else {                                                              //
		if (Meteor.loggingIn()) {                                            // 89
			IonLoading.show();                                                  // 90
		} else {                                                             //
			this.render('login');                                               // 92
		}                                                                    //
	}                                                                     //
}                                                                      //
                                                                       //
function stopSpinner() {                                               // 97
	IonLoading.hide();                                                    // 98
}                                                                      //
                                                                       //
//}                                                                    //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=router.js.map
