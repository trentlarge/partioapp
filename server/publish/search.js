Meteor.publish("search", function() {
	return Search.find({}, {});
});

Meteor.publish("searchData", function(pageNumber, text) {
    pageSize = 5;
    pageNumber = pageNumber || 1;
    //return Search.find({}, { skip: pageNumber * pageSize, limit: pageSize });
    return Search.find({ title: {$regex : ".*"+text+".*"} }, { limit: pageNumber * pageSize });
});
