Products.after.insert(function(userId, doc) {
	refreshSearch(userId, doc)
})

Products.before.update(function(userId, doc) {
	// removeFromSearch(userId, doc.searchId);
	// Products.update({ _id: doc._id },
	// 								{ $set:{ lastSearchId: doc.searchId }})
})

Products.after.update(function (userId, doc) {
		console.log(' depoisssss--------------------------------------')
		console.log(doc);
	refreshSearch(userId, doc)
});

// Products.before.delete(function (userId, doc) {
//   refreshSearch(userId, doc)
// });


function refreshSearch(userId, product){
	var ownerData = Meteor.users.findOne(userId);
	var existingSearch = Search.findOne({title: product.title })
	if (existingSearch) {

		//already have this search id
		if(product.searchId == existingSearch._id){
			return false;

		} else {
			var search_id =  existingSearch._id;
			Products.update({ _id: product._id },
											{ $set:{ searchId: search_id  }})
			updateAuthors(search_id);
		}
	} else {
		var newSearch = {
			image: product.image,
			title: product.title,
			authors: null,
			qty: 0,
		}

		Search.insert(newSearch, function(err, docInserted){
			var search_id =  docInserted;
			Products.update({ _id: product._id },
											{ $set:{ searchId: search_id  }})
			updateAuthors(search_id);
		});
	}

	return true;
}

function updateAuthors(searchId){
	var products = Products.find({ searchId: searchId }).fetch();
	var bufferOwner = []

	for (var i = 0; i < products.length; i++) {
		var owner_ = Meteor.users.findOne(products[i].ownerId);
		if(owner_){
			bufferOwner.push(owner_.profile.name);
		}
	}

	var owners = bufferOwner.join(', ');
	if(owners.length > 0){
		Search.update({_id: searchId },
									{ $set: { authors: owners,
									 	qty: bufferOwner.length }})
	}
}
