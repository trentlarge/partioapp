TransactionsController = RouteController.extend({
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
			Meteor.subscribe("myTransaction")
			// Meteor.subscribe("otherSubscription"),
			// ...
		];
	},

	data: function() {
		return {
			transaction: function(){
				var transaction = Transactions.find().fetch();
				return transaction[0];
			},

			spendingClicked: function() {
				return Session.get('spendClicked');
			},

			earning: function() {
				console.log(this.transaction());
				if(!this.transaction()) {
					return 0;
				}

				return this.transaction().earning;
			},

			totalEarning: function() {
				if(this.transaction()) {
					var total = 0;
					var earningArray = this.transaction().earning;
					earningArray.forEach(function(item) {
						total += (item.receivedAmount || 0);
					});
					return Number(total).toFixed(2);
				}
				return Number(0).toFixed(2);
			},

			earningAvailable: function() {
				if(this.transaction()) {
					return this.transaction().earning.length;
				}
				return 0;
			},

			spending: function() {
				if(!this.transaction()) {
					return 0;
				}

				return this.transaction().spending;
			},

			totalSpending: function() {
				if(this.transaction()) {
					var total = 0;
					var spendingArray = this.transaction().spending;
					spendingArray.forEach(function(item) {
						total += (item.paidAmount || 0);
					});
					return Number(total).toFixed(2);
				}
				return Number(0).toFixed(2);
			},

			spendingAvailable: function() {
				if(this.transaction()) {
					return this.transaction().spending.length;
				}
				return 0;
			},

	    formatDate: function(date) {
	      return formatDate(date);
	    },

			formatValue: function(value){
				return Number(value).toFixed(2);
			}
		};
	},

	onAfterAction: function() {

	}
});
