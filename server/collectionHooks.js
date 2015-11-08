Products.after.insert(function(userId, product) {
	var existingProduct = Search.findOne({"uniqueId": product.uniqueId })
	if (existingProduct) {
		Search.update({_id: existingProduct._id}, {$inc: {qty: 1}})
	} else {
		var newSearch = {
			uniqueId: product.uniqueId,
			image: product.image,
			title: product.title,
			authors: product.authors,
			qty: 1,
			productUniqueId: product._id
		}
		Search.insert(newSearch);
	}
})
