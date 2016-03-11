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
		return [];
	},

	transactions: function(){
		return Transactions.findOne({"userId": Meteor.userId()});
	},

	data: function() {
		return {
			transaction: this.transactions(),

			spendingClicked: function() {
				return Session.get('spendClicked');
			},

			earning: function() {
				if(!this.transaction) {
					return 0;
				}
                
                var earning = this.transaction.earning;

                if(earning.length > 1) {
                    if(earning[0].date > earning[1].date) {
                        earning = earning.reverse();
                    }
                }

				return earning.reverse();
			},

			totalEarning: function() {
				if(this.transaction) {
					var total = 0;
					var earningArray = this.transaction.earning;
					earningArray.forEach(function(item) {
						total += (item.receivedAmount || 0);
					});
					return Number(total).toFixed(2);
				}
				return Number(0).toFixed(2);
			},

			earningAvailable: function() {
				if(this.transaction) {
					return this.transaction.earning.length;
				}
				return 0;
			},

			spending: function() {
				if(!this.transaction) {
					return 0;
				}

                var spending = this.transaction.spending;
                
                if(spending.length > 1) {
                    if(spending[0].date > spending[1].date) {
                        spending = spending.reverse();
                    }
                }
                
				return spending.reverse();
			},

			totalSpending: function() {
				if(this.transaction) {
					var total = 0;
					var spendingArray = this.transaction.spending;
					spendingArray.forEach(function(item) {
						total += (item.paidAmount || 0);
					});
					return Number(total).toFixed(2);
				}
				return Number(0).toFixed(2);
			},

			spendingAvailable: function() {
				if(this.transaction) {
					return this.transaction.spending.length;
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
