ListingController = RouteController.extend({
	onBeforeAction: function() {
		this.next();
	},

	action: function() {
			if(this.ready()) {
				this.render();
			}
	},

	waitOn: function() {
		return [
			// subscribe to data here
			// Meteor.subscribe("someSubscription"),
			Meteor.subscribe("search"),
            Meteor.subscribe("products"),
			// ...
		];
	},

	data: function() {
		return {
			//
			// read data from database here like this:
			//   someData: SomeCollection.find(),
			//   moreData: OtherCollection.find()
			// ...
            getQtyUsers: function(qty) {
                if(qty === 1) {
                    return '1 User';
                }
                return qty + ' Users';
            },

            getMinDayRangePrice: function(title) {

                var products = Products.find({"title": title}).fetch();
                var minPrice = products[0].rentPrice.day;

                $.each(products, function(index, product) {
                    if(product.rentPrice.day < minPrice) {
                        minPrice = product.rentPrice.day;
                    }
                });

                return '$' + minPrice;

            },

            getMinWeekRangePrice: function(title) {

                var products = Products.find({"title": title}).fetch();
                var minPrice = products[0].rentPrice.week;

                $.each(products, function(index, product) {
                    if(product.rentPrice.week < minPrice) {
                        minPrice = product.rentPrice.week;
                    }
                });

                return '$' + minPrice;

            },

            getMinMonthRangePrice: function(title) {

                var products = Products.find({"title": title}).fetch();
                var minPrice = products[0].rentPrice.month;

                $.each(products, function(index, product) {
                    if(product.rentPrice.month < minPrice) {
                        minPrice = product.rentPrice.month;
                    }
                });

                return '$' + minPrice;

            },

            getMinSemesterRangePrice: function(title) {

                var products = Products.find({"title": title}).fetch();
                var minPrice = products[0].rentPrice.semester;

                $.each(products, function(index, product) {
                    if(product.rentPrice.semester < minPrice) {
                        minPrice = product.rentPrice.semester;
                    }
                });

                return '$' + minPrice;

            },


		};
	},

	onAfterAction: function() {

	}
});
