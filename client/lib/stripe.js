app = app || {};

app.model.stripeBalance = (function () {
 'use strict';
  var stripeBalance = {
    check: function() {
    	Meteor.call('stripeTestAddBalance', function(err, result){
    		if(err){
    			console.log(err)
    		}

    		if(result){
    			console.log(result);
    		}
    	});
    }
  }
  return stripeBalance;
})

stripeBalance = new app.model.stripeBalance();