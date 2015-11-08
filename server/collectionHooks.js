Products.after.insert(function(userId, product) {
	var ownerData = Meteor.users.findOne(userId);
	var existingProduct = Search.findOne({"uniqueId": product.uniqueId })
	if (existingProduct) {

		var updatedAuthors = existingProduct.authors+', '+ownerData.profile.name;
		console.log(updatedAuthors);

		Search.update({ _id: existingProduct._id },
									{ $inc: {qty: 1},
										$set: {authors: updatedAuthors }});
	} else {
		var newSearch = {
			uniqueId: product.uniqueId,
			image: product.image,
			title: product.title,
			authors: ownerData.profile.name,
			qty: 1,
			productUniqueId: product._id
		}
		Search.insert(newSearch);
	}
})
