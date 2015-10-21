(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/collectionHooks.js                                           //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
Products.after.insert(function (userId, doc) {                         // 1
	console.log(userId);                                                  // 2
	var existingDoc = Search.findOne({ "ean": doc.ean });                 // 3
	if (existingDoc) {                                                    // 4
		Search.update({ _id: existingDoc._id }, { $inc: { qty: 1 } });       // 5
	} else {                                                              //
		var newDoc = {                                                       // 7
			ean: doc.ean,                                                       // 8
			image: doc.image,                                                   // 9
			title: doc.title,                                                   // 10
			authors: doc.authors,                                               // 11
			qty: 1,                                                             // 12
			productUniqueId: doc._id                                            // 13
		};                                                                   //
		Search.insert(newDoc);                                               // 15
	}                                                                     //
});                                                                    //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=collectionHooks.js.map
