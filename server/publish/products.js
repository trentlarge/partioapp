Meteor.publish("products", function() {
	return Products.find({}, {});
});

Meteor.publish("myProducts", function() {
	return Products.find({ ownerId: this.userId });
});

Meteor.publish("productsListOwner", function(_ownerId) {
	console.log(_ownerId);
	return Products.find({ ownerId: _ownerId });
});

Meteor.publish("singleProduct", function(idProduct) {
	return Products.find({ _id: idProduct}, {limit: 1});
});

Meteor.publish("productsByTitle", function(_title) {
  var cursor = Products.find({ title: _title});
  return Products.publishJoinedCursors(cursor);
});

Meteor.publish("productsData", function(_id, pageNumber, text, categories) {
    pageSize = 5;
    pageNumber = pageNumber || 1;
    
    //return Search.find({}, { skip: pageNumber * pageSize, limit: pageSize });
    return Products.find(
        { 
            ownerId: { $not: { $eq: _id } }, 
            title: { $regex: ".*"+text+".*", $options: 'i' },
            category: { $in: categories }
        }, 
        { 
            limit: pageNumber * pageSize 
        });
});