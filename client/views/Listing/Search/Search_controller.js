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
		let _subs = [ Meteor.subscribe("search", this.params._id), ];

		if(this.search()) {
			_subs.push(Meteor.subscribe("productsByTitle", this.search().title) );

			if(this.productsByTitle()) {
				var _users = []

				this.productsByTitle().map(function(_product){
					_users.push(_product.ownerId)
				})

				_subs.push(Meteor.subscribe("manyUsersById", _users));
			}
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
			peopleList: this.productsByTitle(),

			userThumbnail: function(userId) {
		    return userAvatar(userId);
		  },

		  userName: function(userId) {
		    return Meteor.users.findOne(userId).profile.name;
		  },

		  // peopleList: function() {
		  //   var search = Search.findOne(this._id);
		  //   return Products.find({"title": search.title});
		  // },
		  // isOwner: function() {
		  //     return (this.ownerId === Meteor.userId()) ? true : false;
		  // },
		  // getCondition: function() {
		  //     return Rating.getConditionByIndex(this.conditionId);
		  // },
			//
		  // commonProductTitle: function() {
		  //   var search = Search.findOne(this._id);
		  //   var products = Products.findOne({title: search.title});
		  //   if(!products) {
		  //     console.log(' error products');
		  //   } else {
		  //     return products.title;
		  //   }
		  // },
			//
		  // requestSent: function() {
		  //   //return Connections.findOne({"requestor": Meteor.userId(), "productData.ownerId": this.ownerId, "productData._id": this._id, $or: [ { state: 'WAITING' }, { state: 'PAYMENT' }, { state: 'IN USE' } ]}) ? true : false;
		  //   return Connections.findOne({"requestor": Meteor.userId(), "productData.ownerId": this.ownerId, "productData._id": this._id}) ? true : false;
		  // },
		  // qtynotZero: function() {
			//
		  //   console.log('ID: ' + this._id);
		  //   console.log('qtynotZero: ' + Session.get('currentQty'));
		  //   if(parseFloat(Session.get('currentQty')) < 1)
		  //   {
		  //     return false;
		  //   }
		  //   else
		  //   {
		  //     return true;
		  //   }
		  // },
		  // avgRating: function(userId) {
		  //   if (Meteor.users.findOne(userId).profile.rating) {
		  //     if (Meteor.users.findOne(userId).profile.rating.length > 1) {
		  //       var ratingArray = Meteor.users.findOne(userId).profile.rating;
		  //       var totalCount = ratingArray.length;
		  //       var sum = _.reduce(ratingArray, function(memo, num) {
		  //         return (Number(memo) + Number(num))/totalCount;
		  //       });
		  //       return parseFloat(sum).toFixed(1);
		  //     }
		  //   } else {
		  //     return "1.0";
		  //   }
			//
		  // }

		}
	},

	onAfterAction: function() {

	}
});
