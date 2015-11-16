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
