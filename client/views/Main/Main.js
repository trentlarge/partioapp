Template.main.events({
	'click .bottom-part': function() {
		console.log('bottom-part');
        Session.set('searchText', '');
		Router.go('/categories');
	},

	'click .top-part': function(event){
		CheckStripeAccount();
	}
});

function CheckStripeAccount () {
  if (! Meteor.user().profile.stripeAccount)
  {
    PartioLoad.hide();
    IonPopup.show({
      title: 'ATTENTION!',
      template: '<div class="center">A Debit Card should be linked to receive payments for your shared goods!</div>',
      buttons:
      [{
        text: 'Add Card',
        type: 'button-energized',
        onTap: function()
        {
          IonPopup.close();
          $('#closeLend').click();
          Router.go('/profile/savedcards');
          IonModal.close();
        }
      }]
    });

    return false;
  }
  else
  {
    return true;
  }
}
