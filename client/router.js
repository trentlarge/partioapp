Router.configure({
	trackPageView: true,
	layoutTemplate: 'appLayout',
	routeControllerNameConverter: "upperCamelCase",
	loadingTemplate: 'loadingData',
});

// !!!
// Temporary solution: subscribe to all data before we setup controllers
//
Router.waitOn(function () {
	Meteor.subscribe("myConnections");
	Meteor.subscribe("myNotificationsReceived");
	Meteor.subscribe("userData");
});

//
// !!!

//
// route names don't have underscores (e.g. emailverification) so I didn't left router to auto-choose controller name
// because controller name for (example) emailverification will be "EmailverificationController" - that's unreadable
// this is why we have controller name manually set: { ... , controller: "EmailVerificationController" }
// (which is little bit more readable)
//
Router.route('/', { name: 'main', controller: 'MainController'});
Router.route('/admin', { name: 'admin', controller: 'AdminController'});
Router.route('/analytics/:_id', { name: 'analytics', controller: 'AnalyticsController'});
Router.route('/verify-email/:token', {name: 'emailverification', controller: 'EmailVerificationController'});
Router.route('/reset-password/:token', {name: 'resetpassword', controller: 'ResetPasswordController'});
Router.route('/login', { name: 'login', controller: 'LoginController'});
Router.route('/register', {name: 'register', trackPageView: true, controller: 'RegisterController'});
Router.route('/lend', { name: 'lend', controller: 'LendController' });
Router.route('/lend/details', { name: 'resultsDetails', controller: 'resultsDetailsController' });
Router.route('/inventory', { name: 'inventory', controller: 'InventoryController'});
Router.route('/inventory/:_id', { name: 'inventoryDetail', controller: 'InventoryDetailController' });
Router.route('/inventory/connect/:_id', { name: 'connect', controller: 'ConnectController' });
Router.route('/renting', {name: 'renting', controller: 'RentingController'});
Router.route('/renting/connect/:_id', { name: 'connectRent', controller: 'ConnectRentController' });
Router.route('/talk/:_id', { name: 'talk', controller: 'TalkController' });
Router.route('/categories', { name: 'categories', controller: 'CategoriesController' });
Router.route('/listing', { name: 'listing', trackPageView: true, controller: 'ListingController'});
Router.route('/listing/search/:_id', { name: 'search', controller: 'SearchController' });
Router.route('/listing/search/request/:_id', { name: 'requestRent', controller: 'RequestRentController' });
Router.route('/transactions', { name: 'transactions', controller: 'TransactionsController' });
Router.route('/profile/items/:_id', { name: 'items', controller: 'ItemsController' });
Router.route('/profile', { name: 'profile', controller: 'ProfileController' });
Router.route('/profile/savedcards', { name: 'savedCards', controller: 'SavedCardsController' });
Router.route('/profile/changepassword', { name: 'changePassword', controller: 'ChangePasswordController' });
Router.route('/notifications', { name: 'notifications', controller: 'NotificationsController' }); //  Controlle OK
Router.route('/contact', { name: 'contact', controller: 'ContactController'});
Router.route('/shoutout', { name: 'shoutout', controller: 'ShoutOutController'});
Router.route('/loading', { name: 'loadingData'});

Router.onBeforeAction(function(pause){
	var _user = Meteor.user();

	//has not user
	if(!_user) {

		//user is logging In
		if(Meteor.loggingIn()){
			this.render('loadingData');

		//no user data
		} else {
			Router.go('login');
			// this.render('login');
		}

	//has user
	} else {

		//certify if there is an email and user private data
		if(_user.emails[0].address){
			
			//user is verified
			if(_user.emails[0].verified) {
				
				if(!_user.private) {
					this.render('loadingData');
				
				} else {				

					//FACEBOOK comes with area -1
					if(_user.profile.area == -1 && Tracker.currentComputation.firstRun) {
						
						//define which area user is with GPS coords, if return nothing, his area is 'Others'
						areaFinder(function(area){
							if(!area) {
								area = 0;
							}

							Meteor.call('userAreaUpdate', area);
						})
					}

					//on first time, create transaction id and open tutorial
					if(!_user.private.viewTutorial) {
						
						//creating transaction id
						Meteor.call('checkTransaction');

						//check tutorial ok
						Meteor.call('checkTutorial');
						IonModal.open('tutorial');
					}

					this.next();						
				}

			// user is not verified, goes to profile with 
			} else {
				this.render('profile')
			}

		//if user NOT has email goes to login
		} else {
			this.render('loadingData');
			//this.render('profile')
		}
	}
}, {except: ['resetpassword', 'emailverification', 'register', 'login', 'contact']} );
