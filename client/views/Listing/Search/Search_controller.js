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

		  isOwner: function(productId) {
		      return (this.search.ownerId === Meteor.userId()) ? true : false;
		  },
		  getCondition: function() {
		      return Rating.getConditionByIndex(this.search.conditionId);
		  },

		  requestSent: function() {
		    //return Connections.findOne({"requestor": Meteor.userId(), "productData.ownerId": this.ownerId, "productData._id": this._id, $or: [ { state: 'WAITING' }, { state: 'PAYMENT' }, { state: 'IN USE' } ]}) ? true : false;
		    return Connections.findOne({"requestor": Meteor.userId(), "productData.ownerId": this.ownerId, "productData._id": this._id}) ? true : false;
		  },
		  qtynotZero: function() {
		    console.log('ID: ' + this._id);
		    console.log('qtynotZero: ' + Session.get('currentQty'));
		    if(parseFloat(Session.get('currentQty')) < 1)
		    {
		      return false;
		    }
		    else
		    {
		      return true;
		    }
		  },

			rating: function(userId) {
		    userRating(userId);
		  }
		}
	},

	onAfterAction: function() {

	}
});
