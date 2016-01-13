Users.before.insert(function(userId, doc) {
	if(doc.emails) {
	    if(doc.emails[0] && doc.emails[0].address) {
	      //console.log('facebook data ok');
	    }
		// everything is fine
	} else {
		// we don't have email, copy it from doc.services.facebook.email
		doc.emails = [];
		doc.emails.push({
			address: doc.services.facebook.email,
			verified: true
		});
	}
});
