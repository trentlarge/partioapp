Meteor.methods({
	insertProduct: function(product) {
		Products.insert(product);
	},

	updateProductData: function(productId, image, title, conditionId, rentPrice, selling) {
		Products.update({ 
			_id: productId 
		}, {
			$set: {
				title: title,
                image: image,
        		conditionId: conditionId,
				rentPrice: rentPrice,
                selling: selling
			}
		});
	}
});
