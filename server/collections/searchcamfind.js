SearchCamFind.allow({
	insert: function (userId, doc) {
		return SearchCamFind.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return SearchCamFind.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return SearchCamFind.userCanRemove(userId, doc);
	}
});

SearchCamFind.before.insert(function(userId, doc) {

});

SearchCamFind.before.update(function(userId, doc, fieldNames, modifier, options) {

});

SearchCamFind.before.remove(function(userId, doc) {	

});

SearchCamFind.after.insert(function(userId, doc) {

});

SearchCamFind.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

SearchCamFind.after.remove(function(userId, doc) {
	
});
