//sidemenu events

Template.sidemenu.events({
    'keypress #search': function(e, template) {

        if(e.charCode == 13 || e.keyCore == 13) {   
            var searchText = $('#search').val();

            if(searchText != '') {

                Session.set('searchText', searchText);
                console.log(Session.get('listing'));

                if(Session.get('listing')){
                    PackageSearch.search(searchText);
                    $('.ion-navicon').parent('button').click();
                }
                else {
                    Router.go('listing');
                    $('.ion-navicon').parent('button').click();
                }
            }
        }
    }
})

//sidemenu helpers

Template.sidemenu.helpers({
	'alertCount': function() {
		return Session.get('alertCount');
	},
    'inventoryCount': function() {
        return Connections.find({"productData.ownerId": Meteor.userId()}).count(); //Products.find({"ownerId": Meteor.userId()}).count();
    },
    'rentedCount': function() {
        return Connections.find({"requestor": Meteor.userId()}).count();
    },
    'transactionCount': function() {
        return 0;
    }
})