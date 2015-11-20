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
		return [
			// subscribe to data here
			// Meteor.subscribe("someSubscription"),
			Meteor.subscribe("search"),
			// ...
		];
	},

	data: function() {
		return {
			userThumbnail: function(userId) {
		    return Meteor.users.findOne(userId).profile.avatar === "notSet" ? "/profile_image_placeholder.jpg" : Meteor.users.findOne(userId).profile.avatar;
		  },
		  userName: function(userId) {
		    return Meteor.users.findOne(userId).profile.name;
		  },
		  peopleList: function() {
		    var search = Search.findOne(this._id);
		    return Products.find({"title": search.title});
		  },
		  isOwner: function() {
		      return (this.ownerId === Meteor.userId()) ? true : false;
		  },
		  getCondition: function() {
		      return Rating.getConditionByIndex(this.conditionId);
		  },

		  commonProductTitle: function() {
		    var search = Search.findOne(this._id);
		    var products = Products.findOne({title: search.title});
		    if(!products) {
		      console.log(' error products');
		    } else {
		      return products.title;
		    }
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
		  avgRating: function(userId) {
		    if (Meteor.users.findOne(userId).profile.rating) {
		      if (Meteor.users.findOne(userId).profile.rating.length > 1) {
		        var ratingArray = Meteor.users.findOne(userId).profile.rating;
		        var totalCount = ratingArray.length;
		        var sum = _.reduce(ratingArray, function(memo, num) {
		          return (Number(memo) + Number(num))/totalCount;
		        });
		        return parseFloat(sum).toFixed(1);
		      }
		    } else {
		      return "1.0";
		    }

		  }

		}
	},

	onAfterAction: function() {

	}
});
