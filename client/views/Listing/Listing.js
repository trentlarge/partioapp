// LISTING

Template.listing.rendered = function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
    }

    var data = {
        pageNumber: 1,
        pageSize: 10,
        text: '',
        categories: undefined,
        distance: 10, //miles
        buy: false,
        borrow: true,
        purchasing: true
    };

    if(!Meteor.user()) {
        checkUserLocation(function(location){
            location.point = [location.lat, location.lng];
            Session.set('anonymousUserLocation', location);
        });
    }

    Session.set('listingData', data);

    Session.set('listing', true);

    var inputBox = $('.search-header-input'),
        inputIcon = $('.search-header-icon');

    inputBox.css({
        'width':'100%',
        'padding-left': '40px'
    });

    inputIcon.css({
        'color': '#272727'
    });

};

Template.listing.destroyed = function() {
    Session.set('searchText', '');
    Session.set('listing', false);
    Session.set('categoryIndex', -1);
    Session.set('selectedCategories', null);
    Session.set("borrowFilter", null);
    Session.set("purchasingFilter", null);
    Session.set("distance", null);
    Session.set("active", null)
};

Template.listing.helpers({

    userLogged: function() {
        return (Meteor.user()) ? true : false;
    },

    isActivated: function(index) {
        if(index == 0 && !Session.get('tabBuy')) {
            return 'active';
        }
        else if(index == 1 && Session.get('tabBuy')) {
            return 'active';
        }
        return '';
    }
})

Template.listing.events({

    "click #Buy": function(e, template) {

        if(Session.get('tabBuy')) return;

        $('#Borrow').removeClass('active');
        $('#Buy').addClass('active');

        $('.list-products').fadeOut(function() {
            $('.loadbox').fadeIn('fast', function() {

                Session.set('tabBuy', true);

                // SET NEW DATA
                var data = Session.get('listingData');
                data.pageNumber = 1;
                data.buy = true;
                Session.set('listingData', data);

            });
        });
    },

    "click #Borrow": function(e, template) {

        if(!Session.get('tabBuy')) return;

        $('#Buy').removeClass('active');
        $('#Borrow').addClass('active');

        $('.list-products').fadeOut(function() {
            $('.loadbox').fadeIn('fast', function() {

                Session.set('tabBuy', false);

                // SET NEW DATA
                var data = Session.get('listingData');
                data.pageNumber = 1;
                data.buy = false;
                Session.set('listingData', data);

            });
        });
    },

    "scroll .overflow-scroll": function(e, t) {

        var parent = t.$(e.currentTarget),
            data = Session.get('listingData');

        if($('.product-box').length < data.pageNumber * data.pageSize) {
            return;
        }

        //if(parent.scrollTop() + parent.height() >= scrollingElement.innerHeight() + 20) {
        if(parent.scrollTop() + parent.height() >= parent[0].scrollHeight - 300) {
            $('.loadbox').fadeIn(function(){

                // SET NEW DATA
                data.pageNumber++;
                Session.set('listingData', data);

            });
        }
    }
});

// SEARCH BOX

Template.searchBox.helpers({
    getCategory: function(index) {
        return Categories.getCategory(index);
    },

    isActivated: function(index) {
        if (Session.get('categoryIndex') === index) {
            var selectedCategories = [];
            selectedCategories.push(Categories.getCategory(index));

            // SET NEW DATA
            var data = Session.get('listingData');
            data.categories = selectedCategories;
            Session.set('listingData', data);

            return "active";
        } else {
            return "";
        }
    },

    getCategoryIcon: function(index) {
        return Categories.getCategoryIcon(index);
    }
});

Template.searchBox.events({
    "click .categoryFilter": function(e, template) {

        var categoryFilterBox = $(e.currentTarget),
            categories = Categories.getCategories(),
            selectedCategories = [];

        $('.loadbox').fadeIn('fast');

        categoryFilterBox.toggleClass('active');

        if($('.categoryFilter').hasClass('active')) {

            $.each($('.categoryFilter.active'), function(index, categoryFilter) {
                selectedCategories.push($(categoryFilter).find('span').text());
            });

            // SET NEW DATA
            var data = Session.get('listingData');
            data.categories = selectedCategories;
            data.pageNumber = 1;
            Session.set('listingData', data);

        } else {

            // SET NEW DATA
            var data = Session.get('listingData');
            data.categories = undefined;
            data.pageNumber = 1;
            Session.set('listingData', data);

        }
    }
});

// SEARCH RESULT

Template.searchResult.helpers({
    tabBuy: function() {
        return Session.get('tabBuy');
    },
    searchProducts: function() {
        return Session.get('searchProducts');
    },
    userLogged: function() {
        return (Meteor.user()) ? true : false;
    },
    getDistance: function(productLocation) {
        var user = Meteor.user(),
            userLocation,
            dist;

        if(user && user.profile.location) {
            userLocation = user.profile.location;
        }
        else if(Session.get('anonymousUserLocation')){
            userLocation = Session.get('anonymousUserLocation');
        }

        if(userLocation && productLocation) {
            dist = distance(userLocation.lat, userLocation.lng, productLocation.lat, productLocation.lng, 'M');
            return Number(dist).toFixed(2) + 'mi';
        }
        else {
            return 'no distance';
        }
    }
});

Template.searchResult.events({

    "click .product" : function(e, template) {
        Session.set('listingProduct', true);
    },
});

//:::  Passed to function:                                                    :::
//:::    lat1, lon1 = Latitude and Longitude of point 1 (in decimal degrees)  :::
//:::    lat2, lon2 = Latitude and Longitude of point 2 (in decimal degrees)  :::
//:::    unit = the unit you desire for results                               :::
//:::           where: 'M' is statute miles (default)                         :::
//:::                  'K' is kilometers                                      :::
//:::                  'N' is nautical miles

function distance(lat1, lon1, lat2, lon2, unit) {
	var radlat1 = Math.PI * lat1/180
	var radlat2 = Math.PI * lat2/180
	var theta = lon1-lon2
	var radtheta = Math.PI * theta/180
	var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	dist = Math.acos(dist)
	dist = dist * 180/Math.PI
	dist = dist * 60 * 1.1515
	if (unit=="K") { dist = dist * 1.609344 }
	if (unit=="N") { dist = dist * 0.8684 }
	return dist
}

// LISTING FILTER

Template.listingFilter.rendered = function() {

    var data = Session.get('listingData');

    Session.set('filterDistanceValue', data.distance);

    var filter = $('#filterDistance'),
        val = (Session.get('filterDistanceValue') - filter.attr('min')) / (filter.attr('max') - filter.attr('min'));

    filter.css('background-image',
                '-webkit-gradient(linear, left top, right top, '
                + 'color-stop(' + val + ', #DF5707), '
                + 'color-stop(' + val + ', #EEEEEE)'
                + ')'
                );

};

Template.listingFilter.destroyed = function() {
    Session.set('filterDistanceValue', null);
}

Template.listingFilter.helpers({

    filterDistanceValue: function() {
        return Session.get('filterDistanceValue');
    }

});

Template.listingFilter.events({

    'change #filterDistance': function(e, template) {

        var filter = $(e.target),
            val = (filter.val() - filter.attr('min')) / (filter.attr('max') - filter.attr('min'));

        filter.css('background-image',
                    '-webkit-gradient(linear, left top, right top, '
                    + 'color-stop(' + val + ', #DF5707), '
                    + 'color-stop(' + val + ', #EEEEEE)'
                    + ')'
                    );

        Session.set('filterDistanceValue', filter.val());
    },

    'click #submitFilter': function() {

        if(Session.get('distance') === Session.get('filterDistanceValue')) {
            $('.ion-ios-close-empty').click();
        }
        else {
            PartioLoad.show();

            $('.list-products').fadeOut(function() {
                $('.loadbox').fadeIn('fast', function() {
                    PartioLoad.hide();

                    // SET NEW DATA
                    var data = Session.get('listingData');
                    data.distance = Session.get('filterDistanceValue');
                    Session.set('listingData', data);

                    $('.ion-ios-close-empty').click();
                });
            });
        }

    }

});
