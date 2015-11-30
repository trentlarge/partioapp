Template.main.events({
	'click .bottom-part': function() {
		console.log('bottom-part');
        Session.set('searchText', '');
		Router.go('/listing');
	},

	'click .top-part': function(event){
		if(CheckStripeAccount()) {
      Router.go('/lend');
    }
	}
});

function CheckStripeAccount () {
    if (Meteor.user().profile.cards) {
        if(Meteor.user().profile.cards.data.length > 0) {
            return true;
        }
    }
    else {
      PartioLoad.hide();
      IonPopup.show({
          title: 'ATTENTION!',
          template: '<div class="center">First, you need update you card information!</div>',
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
}
