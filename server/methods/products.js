Meteor.methods({
	updateProductData: function(productId, title, customPrice, rentPrice) {
		Products.update({ 
			_id: productId 
		}, {
			$set: {
				title: title,
				customPrice: customPrice,
				rentPrice: rentPrice
			}
		});
	}
});
