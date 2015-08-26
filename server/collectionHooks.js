Products.after.insert(function(userId, doc) {
	var existingDoc = Search.findOne({"ean": doc.ean})
	if (existingDoc) {
		Search.update({_id: existingDoc._id}, {$inc: {qty: 1}})
	} else {
		var newDoc = {
			ean: doc.ean,
			image: doc.image,
			title: doc.title,
			authors: doc.authors,
			qty: 1
		}
		Search.insert(newDoc);	
	}
})
