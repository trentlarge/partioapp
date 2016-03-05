app = app || {};

app.model.stripeBalance = (function () {
 'use strict';
  var stripeBalance = {
    add: function(value) {
      if(!value){
        return false;
      }

    	Meteor.call('stripeTestAddBalance', value, function(err, result){
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