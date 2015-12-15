SearchController = RouteController.extend({
	onBeforeAction: function() {
		this.next();
	},

	action: function() {
		if(this.ready()){
			this.render();
		}
	},

	waitOn: function() {
		let _subs = [ Meteor.subscribe("search", this.params._id) ];

		if(this.search()) {
			_subs.push(Meteor.subscribe("productsByTitle", this.search().title) );
		}

		return _subs;
	},

	search: function() {
		return Search.findOne(this.params._id);
	},

	productsByTitle: function() {
		if(this.search()) {
			return Products.find({"title": this.search().title});
		}
		return false;
	},

	data: function() {
		return {
            search: this.search(),
            products: this.productsByTitle(),

            ownerAvatar: function(data) {
                return userAvatar(data);
            },
            isNotOwner: function(productId) {
                return (Products.findOne(productId).ownerId !== Meteor.userId()) ? true : false;
            },
            getCondition: function(conditionId) {
                return Rating.getConditionByIndex(conditionId);
            },
            requestSent: function(ownerId, _id) {
                return Connections.findOne({"requestor": Meteor.userId(), "owner": ownerId, "productData._id": _id}) ? true : false;
            },
            isBorrowed: function(ownerId, _id) {
                return Connections.findOne({"requestor": Meteor.userId(), "owner": ownerId, "productData._id": _id, "state":"WAITING"}) ? false : true;
            },
            isUnavailable: function(ownerId, _id) {
                return Connections.findOne({"owner": ownerId, "productData._id": _id}) ? true : false;
            },
            rating: function(userId) {
                userRating(userId);
            }
		}
	},

	onAfterAction: function() {

	}
});
