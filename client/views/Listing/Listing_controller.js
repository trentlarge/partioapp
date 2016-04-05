ListingController = RouteController.extend({
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

    subscribeProducts: function() {
        var user = Meteor.user(),
            data = Session.get('listingData');

        if(!data) { return false; }

        if(user) {
            data.ownerId = user._id;
        }
        else {
            if(Session.get('anonymousUserLocation')) {
                data.location = Session.get('anonymousUserLocation');
            }
        }

        var handle = Meteor.subscribe("listingProducts", data, function() {
            setTimeout(function(){
                $('.loadbox').fadeOut('fast', function() {
                    if(!$('.list-products').is(':visible')) {
                        $('.list-products').fadeIn();
                    }
                });
            }, 100);
        });

        var filter = {
            sold: { $ne: true }
        }

        if(data.ownerId) {
            filter.ownerId = { $ne: data.ownerId };
        }

        if(data.text && data.text.length > 0) {
            filter.title = { $regex: ".*" + data.text + ".*", $options: 'i' };
        }

        if(data.categories) {
            filter.category = { $in: data.categories };
        }

        if(data.borrow) {
            filter.borrow = { $ne: true };
        }

        if(data.purchasing) {
            filter.purchasing = { $ne: true };
        }

        if(data.buy) {
            filter['selling.status'] = 'ON';
        }
        else {
            filter['rentPrice.status'] = { $ne: 'OFF' };
        }

        Tracker.autorun(function() {
            if (handle.ready()) {
                Session.set('searchProducts', Products.find(filter).fetch());
            }
        });
    },

    data: function() {

        var prod = this.subscribeProducts();

        return {
            //searchProducts: prod,

            // hasProducts: function() {
            //     return (prod && prod.length > 0) ? true : false;
            // },

            isSellingStatusOn: function(sellingStatus) {
                return (sellingStatus === 'ON') ? true : false;
            },

            testIsReady: function() {
                return false;
            }
        };
    },

    onAfterAction: function() {

    }
});
