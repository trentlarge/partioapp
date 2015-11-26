refreshSearch = function(userId, product){
		var ownerData = Meteor.users.findOne(userId);
		var existingSearch = Search.findOne({title: product.title })

		var currentSearchId = null;

		if(product.searchId){
			currentSearchId = product.searchId;
		}

		//there is some search with this title
		if (existingSearch) {

			//Product already have this searchId
			if(currentSearchId == existingSearch._id){
				return false;

			//Changing this product last searchId to another exisiting searchId
			} else {
				var search_id =  existingSearch._id;
				Products.update({ _id: product._id },
												{ $set:{ searchId: search_id  }})

				//Update the Authors related of this searchId
				updateAuthors(search_id, function(){

					//If product had another searchId before, update this another searchId
					if(currentSearchId){
						updateAuthors(currentSearchId);
					}
				});
			}

		//creating a new search
		} else {
			var newSearch = {
				image: product.image,
				title: product.title,
				authors: null,
				qty: 0,
			}

			//Inserting new Search
			Search.insert(newSearch, function(err, docInserted){
				var search_id =  docInserted;
				Products.update({ _id: product._id },
												{ $set:{ searchId: search_id  }})

				//Update Authors from this new Search.
				updateAuthors(search_id, function(){

					//If product had another searchId before, update this another searchId
					if(currentSearchId){
						updateAuthors(currentSearchId);
					}
				});
			});
		}

		return true;
	}
