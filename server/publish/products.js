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

Meteor.publish("productsInArray", function(productsId) {
	return Products.find({ _id: { $in: productsId }});
});

Meteor.publish("productsByTitle", function(_title) {
  var cursor = Products.find({ title: _title });
  return Products.publishJoinedCursors(cursor);
});

Meteor.publish("productsData", function(ownerId, ownerArea, pageNumber, text, categories) {
    var pageSize = 15;
    pageNumber = pageNumber || 1;

    var _ownerArea = ownerArea.toString();

    return Products.find({
        ownerId: { $ne: ownerId },
        ownerArea: _ownerArea,
        title: { $regex: ".*"+text+".*", $options: 'i' },
        category: { $in: categories },
        sold: { $ne: true }
    }, {
        limit: pageNumber * pageSize
    });
});

Meteor.publish("listingProducts", function(data) {

    var miles = 15,
        inMeters = miles*1609.34;


    var pageNumber = data.pageNumber || 1,
        pageSize = 15,
        filter = {
            ownerId: { $ne: data.ownerId },
            //ownerArea: data.ownerArea.toString(),
            title: { $regex: ".*" + data.text + ".*", $options: 'i' },
            category: { $in: data.categories },
            sold: { $ne: true }
        }

       // console.log(data.location.lat, data.location.lng, Number(data.location.lat), Number(data.location.lng))

    if(data.location) {
        if(data.location.lat && data.location.lng) {
            filter['location.point'] =  { $near :
                                          {
                                            $geometry: { 
                                              type: "Point",  
                                              coordinates: [ Number(data.location.lat), Number(data.location.lng) ] 
                                            }
                                          },

                                          //$minDistance: 1000,
                                          $maxDistance: inMeters
                                        };
        }
    }



    if(data.borrow) {
        filter.borrow = { $ne: true };
    }

    if(data.purchasing) {
        filter.purchasing = { $ne: true };
    }

  	if(data.buy) {
  		filter['selling.status'] = 'ON';
  	}
  	else {
  		filter['rentPrice.status'] = { $ne: 'OFF' };
  	}

    return Products.find(filter, {
        limit: pageNumber * pageSize
    });
});
