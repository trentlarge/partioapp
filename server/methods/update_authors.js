Meteor.methods({
	updateAuthors:function(searchId){
		console.log('update authors ---------'+searchId)
	 var products = Products.find({ searchId: searchId }).fetch();
	 console.log(products);
	 var bufferOwner = []

	 if(products.length > 0){

		 for (var i = 0; i < products.length; i++) {
			 var owner_ = Meteor.users.findOne(products[i].ownerId);
			 if(owner_){
				 bufferOwner.push(owner_.profile.name);
			 }
		 }

		 var owners = bufferOwner.join(', ');

		 console.log(owners);

		 if(bufferOwner.length > 0){
			 Search.update({_id: searchId },
										 { $set: { authors: owners,
											 qty: bufferOwner.length }}, function(){
												return true;
											 })
		 }

		} else {
			Search.remove({_id:searchId});
		}
	}
});
