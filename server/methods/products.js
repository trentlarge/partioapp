Meteor.methods({
	insertProduct: function(product) {
		Products.insert(product);
	},

	updateProductData: function(productId, title, conditionId, rentPrice, image) {
		Products.update({ 
			_id: productId 
		}, {
			$set: {
				title: title,
                image: image,
        		conditionId: conditionId,
				rentPrice: rentPrice
			}
		});
	}
});
