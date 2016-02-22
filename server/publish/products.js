Meteor.publish("adminSearchOwnerProducts", function(ownerId) {
	return Products.findOne({ ownerId: ownerId });
});

Meteor.publish("adminSearchProducts", function(text, limit) {
	return Products.find({ 
        'title': { $regex: ".*"+text+".*", $options: 'i' }, 
    }, { 
        limit: limit, 
        sort: { 'title': 1 }
    });
});

Meteor.publish("products", function() {
	return Products.find({});
});

Meteor.publish("loginProducts", function() {
	return Products.find({ sold: { $ne: true }, image: { $ne: "/image-not-available.png" } }, { sort: { _id: -1 }, limit: 32 });
});

Meteor.publish("myProducts", function() {
	return Products.find({ ownerId: this.userId });
});

Meteor.publish("productsListOwner", function(_ownerId) {
	return Products.find({ ownerId: _ownerId });
});

Meteor.publish("singleProduct", function(idProduct) {
	return Products.find({ _id: idProduct}, {limit: 1});
});

Meteor.publish("productsByTitle", function(_title) {
  var cursor = Products.find({ title: _title });
  return Products.publishJoinedCursors(cursor);
});

Meteor.publish("productsData", function(ownerId, ownerArea, pageNumber, text, categories) {
    var pageSize = 15;
    pageNumber = pageNumber || 1;

    return Products.find({
        ownerId: { $ne: ownerId },
        ownerArea: ownerArea,
        title: { $regex: ".*"+text+".*", $options: 'i' },
        category: { $in: categories },
        sold: { $ne: true }
    }, {
        limit: pageNumber * pageSize
    });
});
