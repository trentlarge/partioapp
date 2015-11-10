Meteor.publish("searchcamfind", function() {
	return SearchCamFind.find({}, {});
});
