Meteor.methods({
    
    removeProduct: function(productId) {
        Products.remove({_id: productId});
    },
    
	insertProduct: function(product) {
		return Products.insert(product);
	},

	updateProductData: function(productId, image, title, category, conditionId, rentPrice, selling) {
		Products.update({ 
			_id: productId 
		}, {
			$set: {
				title: title,
                image: image,
        		conditionId: conditionId,
				rentPrice: rentPrice,
                selling: selling,
                category: category
			}
		});
	}
});
