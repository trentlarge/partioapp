Meteor.methods({
	insertProduct: function(product) {
		Products.insert(product);
	},
	updateProductData: function(productId, title, conditionId, rentPrice) {
		Products.update({ 
			_id: productId 
		}, {
			$set: {
				title: title,
                conditionId: conditionId,
				rentPrice: rentPrice
			}
		});
	}
});
