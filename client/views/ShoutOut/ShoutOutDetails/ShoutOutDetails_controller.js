ShoutOutDetailsController = RouteController.extend({
	onBeforeAction: function() {
		this.next();
	},

	action: function() {
		if(this.ready()) {
			this.render();
		}
	},

	waitOn: function() {
        return [
            //Meteor.subscribe('shoutoutDetails', this.params._id),
            //Meteor.subscribe('myProducts')
        ];
	},
    
    getShout: function() {
        Meteor.subscribe('shoutoutDetails', this.params._id);
        var shout = ShoutOut.findOne(this.params._id);
        if(shout) {
            Meteor.subscribe('singleUser', shout.userId);
            Session.set('shout', shout);
            
            var sharedProductsIds = [];
            $.each(shout.sharedProducts, function(index, sharedProduct) {
                sharedProductsIds.push(sharedProduct._id); 
            });
            
            Meteor.subscribe('productsInArray', sharedProductsIds, function() {
                 
                var products = Products.find({ _id: { $in: sharedProductsIds }}).fetch();    
                
                // UPDATE SHOUT OUT
                if(products.length != sharedProductsIds.length) {
//                    console.log(products.length + ' ' + sharedProductsIds.length)

                    productsIds = [];
                    $.each(products, function(index, product) {
                        productsIds.push(product._id); 
                    });

                    $.each(sharedProductsIds, function(index, sharedProductsId) {
                        if(products.length == 0 || sharedProductsId.indexOf(productsIds) < 0) {
                            Meteor.call('removeSharedProduct', shout._id, sharedProductsId, function() {
                                //Shared Product removed!
                            })     
                        }
                    });
                }   
                
            });

            return shout;
        }
    },
    
    getProducts: function() {
        Meteor.subscribe('myProducts');
        var products = Products.find({ownerId: Meteor.userId()}).fetch();
        if(products) {
            Session.set('products', products);
            return products;
        }
    },
    
    data: function() {
		return {
            shout: this.getShout(),
            products: this.getProducts(),
            
            getUser: function(userId) {
                return Users.findOne(userId);
            },
            
            productExist: function(productId) {
                return (Products.findOne(productId)) ? true : false;  
            },
            
            getTime: function(createdAt) {
                
                var date = new Date();
                var today = {
                    seconds: date.getSeconds(),
                    minutes: date.getMinutes(),
                    hours: date.getHours(),
                    day: date.getDate(),
                    month: date.getMonth(),
                    year: date.getFullYear(),
                }
                
                date = new Date(createdAt);
                var shoutTime = {
                    seconds: date.getSeconds(),
                    minutes: date.getMinutes(),
                    hours: date.getHours(),
                    day: date.getDate(),
                    month: date.getMonth(),
                    year: date.getFullYear(),
                } 
                
                if(shoutTime.year != today.year) {
                    return (today.year - shoutTime.year) + ' years ago';
                }
                
                if(shoutTime.month != today.month) {
                    return (today.month - shoutTime.month) + ' months ago';
                }
                
                if(shoutTime.day != today.day) {
                    return (today.day - shoutTime.day) + ' days ago';
                }
                
                if(shoutTime.hours != today.hours) {
                    
                    if((today.hours - shoutTime.hours) == 1 && (today.minutes + 60 - shoutTime.minutes) < 60) {
                        return (today.minutes + 60 - shoutTime.minutes) + 'm';
                    }
                    
                    return (today.hours - shoutTime.hours) + 'h';
                }
                
                if(shoutTime.minutes != today.minutes) {
                    
                    if((today.minutes - shoutTime.minutes) == 1 && (today.seconds + 60 - shoutTime.seconds) < 60) {
                        return (today.seconds + 60 - shoutTime.seconds) + 's';
                    }
                    
                    return (today.minutes - shoutTime.minutes) + 'm';
                }
                
                if(shoutTime.seconds != today.seconds) {
                    return (today.seconds - shoutTime.seconds) + 's';
                }
                
                return 'now';
                
            },
            
        }
    },
    
    onAfterAction: function() {

	}
    
});