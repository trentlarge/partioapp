ShoutOutController = RouteController.extend({
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
            //Meteor.subscribe('shoutout')
        ];
	},
    
    shouts: function() {
        
        var pageNumber = Session.get('shoutsPageNumber');
        var pageSize = Session.get('shoutsPageSize');
        
        var limit = pageSize * pageNumber;
        
        if(Session.get('tabMyShouts')) {
            Meteor.subscribe('myShoutout', Meteor.userId(), limit, function() {
                setTimeout(function(){
                    $('.loadbox').fadeOut();
                }, 100);
            });
        }
        else {
            Meteor.subscribe('shoutout', limit, function() {
                setTimeout(function(){
                    $('.loadbox').fadeOut();
                }, 100);
            });
        }
        
        var shouts = ShoutOut.find({}, {sort: {createdAt: -1}}).fetch();
        var usersId = [];
        
        $.each(shouts, function(index, shout) {
            usersId.push(shout.userId);
        });
               
        Meteor.subscribe('usersInArray', usersId);   
        
        var sharedProductsIds = [];
        var shoutIds = [];
        $.each(shouts, function(index, shout) {
            if(shout.type == 'share') {
                sharedProductsIds.push(shout.sharedProducts[0]._id); 
                shoutIds.push(shout._id);
            }
        });
        
        if(sharedProductsIds.length > 0) {
            Meteor.subscribe('productsInArray', sharedProductsIds);
        }
        
//
//        if(sharedProductsIds.length > 0) {
//            Meteor.subscribe('productsInArray', sharedProductsIds, function() {
//                var products = Products.find({ _id: { $in: sharedProductsIds }}).fetch();    
//
//                // UPDATE SHOUT OUT
//                if(products.length != sharedProductsIds.length && products.length > 0 ) {
//
//                    productsIds = [];
//                    $.each(products, function(index, product) {
//                        productsIds.push(product._id); 
//                    });
//
//                    $.each(sharedProductsIds, function(index, sharedProductsId) {
//
//                        if(sharedProductsId.indexOf(productsIds) < 0) {
//                            Meteor.call('removeShoutOut', shoutIds[index], function() {
//                                //Shared Product removed!
//                            })     
//                        }
//                    });
//                }   
//            });
//        }

        return shouts;
    },
    
    
    data: function() {
        
		return {
            shouts: this.shouts(),
            
            isTypeShout(type) {
                return (type === 'shout') ? true : false;
            },
            
            getUser(userId) {
                return Users.findOne(userId);
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
                
            }
        }
    },

	onAfterAction: function() {

	}
    
});