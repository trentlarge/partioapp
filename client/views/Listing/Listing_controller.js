var pageSize = 15;

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

    searchProducts: function() {
        var pageNumber = Session.get('pageNumber') || 1,
            text = Session.get('searchText'),
            categories = Session.get('selectedCategories'),
            user = Meteor.user();

        if(!user) { return; }

        if(!categories) {
            categories = Categories.getAllCategoriesText();
        }

        var data = {
            ownerId: user._id,
            ownerArea: user.profile.area,
            pageNumber: pageNumber,
            text: text,
            categories: categories,
            buy: false
        }

        if(Session.get('tabBuy')) {
            data.buy = true;
        }

        if(!Session.get("borrowFilter")) {
            data.borrow = true;
        }

        if(!Session.get("purchasingFilter")) {
            data.purchasing = true;
        }

        Meteor.subscribe("listingProducts", data, function() {
            setTimeout(function(){
                $('.loadbox').fadeOut('fast', function() {
                    if(!$('.list-products').is(':visible')) {
                        $('.list-products').fadeIn();
                    }
                });
            }, 100);
        });

        var filter = {
                ownerId: { $ne: data.ownerId },
                ownerArea: data.ownerArea.toString(),
                title: { $regex: ".*" + data.text + ".*", $options: 'i' },
                category: { $in: data.categories },
                sold: { $ne: true }
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

        var products = Products.find(filter);

        Session.set("pageNumberLoaded", Math.ceil(products.count() / pageSize));

        return products;
    },

    data: function() {

        var prod = this.searchProducts();

        return {
            searchProducts: prod,

            hasProducts: prod ? !!prod.count() : false,

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
