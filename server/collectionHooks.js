Products.after.insert(function(userId, doc) {
	Meteor.call('refreshSearch', userId, doc);
})

Products.before.update(function(userId, doc) {
	// removeFromSearch(userId, doc.searchId);
	// Products.update({ _id: doc._id },
	// 								{ $set:{ lastSearchId: doc.searchId }})
})

Products.after.update(function (userId, doc) {
	Meteor.call('refreshSearch', userId, doc);
});

// Products.before.delete(function (userId, doc) {
//   refreshSearch(userId, doc)
// });


Meteor.methods({
	refreshSearch: function(userId, product){
		var ownerData = Meteor.users.findOne(userId);
		var existingSearch = Search.findOne({title: product.title })

		var last_search = null;

		if(product.searchId){
			last_search = product.searchId;
		}

		if (existingSearch) {

			//already have this search id
			if(product.searchId == existingSearch._id){
				return false;

			//going to another search
			} else {
				var search_id =  existingSearch._id;
				Products.update({ _id: product._id },
												{ $set:{ searchId: search_id  }})

				Meteor.call('updateAuthors', search_id, function(){
					if(last_search){
						console.log('===========================')
						Meteor.call('updateAuthors', last_search);
					}
				});
			}

		//creating a new
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

				Meteor.call('updateAuthors', search_id, function(){
					if(last_search){
						console.log('===========================')
						Meteor.call('updateAuthors', last_search);
					}
				});
			});
		}

		// if(last_search){
		// 	console.log('===========================')
		// 	Meteor.call('updateAuthors', last_search);
		// }

		return true;

	}
});


Meteor.methods({
	updateAuthors:function(searchId){
		console.log('update authors ---------'+searchId)
	 var products = Products.find({ searchId: searchId }).fetch();
	 console.log(products);
	 var bufferOwner = []

	 if(products.length > 0){

		 for (var i = 0; i < products.length; i++) {
			 var owner_ = Meteor.users.findOne(products[i].ownerId);
			 if(owner_){
				 bufferOwner.push(owner_.profile.name);
			 }
		 }

		 var owners = bufferOwner.join(', ');

		 console.log(owners);

		 if(bufferOwner.length > 0){
			 Search.update({_id: searchId },
										 { $set: { authors: owners,
											 qty: bufferOwner.length }}, function(){
												return true;
											 })
		 }

		} else {
			Search.remove({_id:searchId});
		}
	}
});
