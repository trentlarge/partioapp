Meteor.methods({
	updateUserProfile: function(profile) {
//		var updateProfile = {};
		//
		// console.log(profile);
		// return false;

		// for(var key in profile) {
		// 	updateProfile["profile." + key] = profile[key];
		// }

		// if(!updateProfile) {
		// 	return;
		// }

		Meteor.users.update({_id: this.userId },{
			$set: { 'private.mobile': profile.mobile,
			 				'profile.birthDate': profile.birthDate }
		});
	},

	'updateOfficialEmail': function(college, email) {
		Meteor.users.update({"_id": this.userId}, {$set: {"emails": [{"address": email, "verified": false}], "profile.college": college}}, function(error) {
			if (!error) {
				Accounts.sendVerificationEmail(userId);
			}
		});
	},
	'updatePassword': function(password) {
		console.log('chamou updatePassword');
		Meteor.bindEnvironment(function() {
			Accounts.setPassword(this.userId, password, { logout: false });
		},
		function (err) {
			console.log('failed to bind env: ', err);
		});
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
	}
});
