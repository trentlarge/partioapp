SearchCamFind = new Meteor.Collection('searchcamfind');

SearchCamFind.userCanInsert = function(userId, doc) {
	return true;
};

SearchCamFind.userCanUpdate = function(userId, doc) {
	return true;
};

SearchCamFind.userCanRemove = function(userId, doc) {
	return true;
};
