refreshSearch = function(userId, product){
		var ownerData = Meteor.users.findOne(userId);
		var existingSearch = Search.findOne({title: product.title })
		var qty_products = Search.findOne({_id: product.searchId })


		var currentSearchId = null;

		if(product.searchId){
			currentSearchId = product.searchId;
		}

		//there is some search with this title
		if (existingSearch) {

			console.log('existe search');

			//Product already have this searchId
			// Produto já têm este searchId
			if(currentSearchId == existingSearch._id){
				return false;

			//Changing this product last searchId to another exisiting searchId
			// A alteração deste último produto searchId para outro searchId exisiting
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

			console.log('##############');
			console.log(qty_products);
			//updateAuthors(product.searchId);
			var products = Products.find({ searchId: qty_products._id }).fetch();

			console.log('##############'+products.length);

			console.log('QUANTIDADE DE PRODUTOS: '+products.length);

			if(products.length === 0){

				Search.remove({_id:qty_products._id});
				console.log('############## APAGOU 2');

			}



	} else if(product.searchId && qty_products.qty === 1) {

			console.log('update search');

			var newSearch = {
				image: product.image,
				title: product.title,
				authors: null,
				qty: 0,
			}

			//
			// var search_id =  existingSearch._id;
			// Products.update({ _id: product._id },
			// 								{ $set:{ searchId: search_id  }})

			//Inserting new Search
			Search.update(product.searchId, newSearch);
			//Update the Authors related of this searchId
			updateAuthors(product.searchId, function(){
				//If product had another searchId before, update this another searchId
				if(currentSearchId){
					updateAuthors(currentSearchId);
				}
			});


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
