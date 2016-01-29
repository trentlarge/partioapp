Meteor.methods({
	updateUserProfile: function(profile) {
		var updateProfile = {};

		for(var key in profile) {
			if(key == 'mobile'){
				updateProfile["private." + key] = profile[key];
			} else {
				updateProfile["profile." + key] = profile[key];
			}
		}

		if(!updateProfile) {
		 	return;
		}

		Meteor.users.update({_id: this.userId },{
			$set: updateProfile
		});
	},

	// 'updateOfficialEmail': function(college, email) {
	// 	Meteor.users.update({"_id": this.userId}, {$set: {"emails": [{"address": email, "verified": false}], "profile.college": college}}, function(error) {
	// 		if (!error) {
	// 			Accounts.sendVerificationEmail(userId);
	// 		}
	// 	});
	// },

	'resendValidation': function(email) {
		Accounts.sendVerificationEmail(email);
	},
	'sendEmail': function (subject, text) {
	  check([subject, text], [String]);

		var _user = Meteor.user();

		// Let other method calls from the same client start running,
		// without waiting for the email sending to complete.
		this.unblock();

		console.log('SEND FORM CONTACT');

		text+= '\n\n';
		text+= 'Name: '+_user.profile.name;
		text+= '\n';
		text+= 'From: '+_user.emails[0].address;

		Email.send({
			to: 'support@partioapp.com',
			from: 'support@partioapp.com',
			subject: subject,
			text: text
		});
	},
	'userCanShare': function(){
		return Meteor.user().secret.canShare
	},

	'userCanBorrow': function(){
		return Meteor.user().secret.canBorrow;
	},

	checkTutorial: function(){
		Meteor.users.update({"_id": this.userId }, {$set: { "private.viewTutorial": true }}, function(error) {
			if(error) {
				return false;
			}

			return true;
		});
	},

	userAreaUpdate: function(area){
		Meteor.users.update({"_id": this.userId }, {$set: { "profile.area": area }}, function(error) {
			if(error) {
				return false;
			}

			return true;
		});
	}
});
