// LISTING

Template.listing.rendered = function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
    }


    if(!Session.get('searchText')) {
        Session.set('searchText', '');
    }

    Session.set("pageSize", 15);
    Session.set("pageNumber", 1);
    Session.set("pageNumberLoaded", 0);

    // distance default in miles
    Session.set("distance", 10);

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

Template.listing.helpers({

    isActivated: function(index) {
        if(index == 0 && !Session.get('tabBuy')) {
            return 'active';
        }
        else if(index == 1 && Session.get('tabBuy')) {
            return 'active';
        }
        return '';
    },

})

Template.listing.events({

    "click #Buy": function(e, template) {

        if(Session.get('tabBuy')) return;

        $('#Borrow').removeClass('active');
        $('#Buy').addClass('active');

        $('.list-products').fadeOut(function() {
            $('.loadbox').fadeIn('fast', function() {
                Session.set("pageNumber", 1);
                Session.set('tabBuy', true);
            });
        });
    },

    "click #Borrow": function(e, template) {

        if(!Session.get('tabBuy')) return;

        $('#Buy').removeClass('active');
        $('#Borrow').addClass('active');

        $('.list-products').fadeOut(function() {
            $('.loadbox').fadeIn('fast', function() {
                Session.set("pageNumber", 1);
                Session.set('tabBuy', false);
            });
        });
    },

    "click .filter-borrow": function(e, t) {
        $(e.target).toggleClass('active');
        var borrow = true;

        if(Session.get('borrowFilter')) {
            borrow = false;
        }

        $('.list-products').fadeOut(function() {
            $('.loadbox').fadeIn('fast', function() {
                Session.set('borrowFilter', borrow);
            });
        });

    },

    "click .filter-purchasing": function(e, t) {
        $(e.target).toggleClass('active');
        var purchasing = true;

        if(Session.get('purchasingFilter')) {
            purchasing = false;
        }

        $('.list-products').fadeOut(function() {
            $('.loadbox').fadeIn('fast', function() {
                Session.set('purchasingFilter', purchasing);
            });
        });
    },

    "scroll .overflow-scroll": function(e, t) {

        var parent = t.$(e.currentTarget),
            pageNumber = Session.get('pageNumber') || 1,
            pageSize = Session.get('pageSize');

        if($('.product-box').length < pageNumber * pageSize) {
            return;
        }

        //if(parent.scrollTop() + parent.height() >= scrollingElement.innerHeight() + 20) {
        if(parent.scrollTop() + parent.height() >= parent[0].scrollHeight - 300) {
            $('.loadbox').fadeIn(function(){
                var loadedPage = Session.get("pageNumberLoaded") || 0;
                Session.set("pageNumber", loadedPage + 1);
            });
        }
    }
});


Template.listing.destroyed = function() {
    Session.set('searchText', '');
    Session.set('listing', false);
    Session.set('categoryIndex', -1);
    Session.set('selectedCategories', null);
    Session.set("borrowFilter", null);
    Session.set("purchasingFilter", null);
};

// SEARCH BOX

Template.searchBox.helpers({
    getCategory: function(index) {
        return Categories.getCategory(index);
    },

    isActivated: function(index) {
        if (Session.get('categoryIndex') === index) {
            var selectedCategories = [];
            selectedCategories.push(Categories.getCategory(index));
            Session.set('selectedCategories', selectedCategories);
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

            Session.set("selectedCategories", selectedCategories);
            Session.set("pageNumber", 1);

        } else {

            Session.set("selectedCategories", null);
            Session.set("pageNumber", 1);

        }
    }
});

// SEARCH RESULT

Template.searchResult.helpers({

    tabBuy: function() {
        return Session.get('tabBuy');
    }
});

Template.searchResult.events({

    "click .product" : function(e, template) {
        Session.set('listingProduct', true);
    },
});


// LISTING FILTER

Template.listingFilter.rendered = function() {

    Session.set('filterDistanceValue', Session.get('distance'));

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

        PartioLoad.show();

        $('.list-products').fadeOut(function() {
            $('.loadbox').fadeIn('fast', function() {
                PartioLoad.hide();
                Session.set('distance', Session.get('filterDistanceValue'));
                $('.ion-ios-close-empty').click();
            });
        });

    }

});
