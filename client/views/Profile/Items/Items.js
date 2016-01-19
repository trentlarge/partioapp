Template.items.onCreated(function () {
	this.subscribe("singleUser", Router.current().params._id);
	this.subscribe("productsListOwner", Router.current().params._id);
});
