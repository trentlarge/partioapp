Template.renting.rendered = function() {
    Session.set('isTapping', false);
}

Template.renting.helpers({
  toBeApproved: function() {
    return Connections.find({"requestor": Meteor.userId(), "state": "WAITING"}); //{$ne: "IN USE", $ne: "DONE"}})
  },
  toBePaid: function() {
    return Connections.find({"requestor": Meteor.userId(), "state": "PAYMENT"}); //{$ne: "IN USE", $ne: "DONE"}})
  },
  currentlyBorrowed: function() {
    return Connections.find({"requestor": Meteor.userId(), "state": "IN USE"}); //{$ne: "IN USE", $ne: "DONE"}})
  	//return Connections.find({"requestor": Meteor.userId(), "state": "DONE"});
  },
  dataExists: function() {
  	return (Connections.find({"requestor": Meteor.userId(), "state": {$ne: "IN USE"}}).count() || Connections.find({"requestor": Meteor.userId(), "state": "IN USE"}).count()) ? true : false;
  },
  isReturned: function() {
    return (Connections.find({"requestor": Meteor.userId(), "state": "RETURNED"}));
  },
  itemReturned: function() {
    return (Connections.find({"requestor": Meteor.userId(), "state": "RETURNED"})).count();
  },
  isTapping: function() {
      return Session.get('isTapping');
  }
});

Template.renting.events({
	'click .borrowedBookDetail': function() {
		Router.go('/listing/'+this.productData._id);
	},
    'click .waiting': function() {

        var waiting = $('.waiting');
        var waitingItem = $('.waiting-item');

        if(waitingItem.hasClass('hidden')){
            waitingItem.removeClass('hidden');
            waiting.find('.chevron-icon').removeClass('ion-chevron-right').addClass('ion-chevron-down');
        }
        else {
            waitingItem.addClass('hidden');
            waiting.find('.chevron-icon').removeClass('ion-chevron-down').addClass('ion-chevron-right');
        }
    },
    'click .payment': function() {

        var payment = $('.payment');
        var paymentItem = $('.payment-item');

        if(paymentItem.hasClass('hidden')){
            borrowedItem.removeClass('hidden');
            payment.find('.chevron-icon').removeClass('ion-chevron-right').addClass('ion-chevron-down');
        }
        else {
            paymentItem.addClass('hidden');
            payment.find('.chevron-icon').removeClass('ion-chevron-down').addClass('ion-chevron-right');
        }
    },
    'click .borrowed': function() {

        var borrowed = $('.borrowed');
        var borrowedItem = $('.borrowed-item');

        if(borrowedItem.hasClass('hidden')){
            borrowedItem.removeClass('hidden');
            borrowed.find('.chevron-icon').removeClass('ion-chevron-right').addClass('ion-chevron-down');
        }
        else {
            borrowedItem.addClass('hidden');
            borrowed.find('.chevron-icon').removeClass('ion-chevron-down').addClass('ion-chevron-right');
        }
    },
    'click .returned': function() {

        var returned = $('.returned');
        var returnedItem = $('.returned-item');

        if(returnedItem.hasClass('hidden')){
            returnedItem.removeClass('hidden');
            returned.find('.chevron-icon').removeClass('ion-chevron-right').addClass('ion-chevron-down');
        }
        else {
            returnedItem.addClass('hidden');
            returned.find('.chevron-icon').removeClass('ion-chevron-down').addClass('ion-chevron-right');
        }
    },
});
