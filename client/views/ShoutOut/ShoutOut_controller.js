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
        
        var pageNumber = Session.get('shoutsPageNumber'),
            pageSize = Session.get('shoutsPageSize'),
            limit = pageSize * pageNumber;
        
        if(Session.get('tabMyShouts')) {
            Meteor.subscribe('myShoutout', Meteor.userId(), limit, function() {
                setTimeout(function(){
                    $('.loadbox').fadeOut();
                }, 100);
            });
        }
        else {
            Meteor.subscribe('shoutout', Meteor.user(), limit, function() {
                setTimeout(function(){
                    $('.loadbox').fadeOut();
                }, 100);
            });
        }
        
        var shouts = ShoutOut.find({}, {sort: {createdAt: -1}}).fetch(),
            sharedProductsIds = [];

        $.each(shouts, function(index, shout) {
            if(shout.type == 'share') {
                sharedProductsIds.push(shout.sharedProducts[0]._id); 
            }
        });
        
        //Get all share products to check if they exist.
        if(sharedProductsIds.length > 0) {
            Meteor.subscribe('productsInArray', sharedProductsIds);
        }

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
            
            myShouts: function() {
                if(!this.shouts) return;
                
                var myShouts = this.shouts.filter(function(shout) {
                    return shout.userId === Meteor.userId();
                })
                
                return myShouts;
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
            
            hasSharedProducts: function(sharedProductsLength) {
                return (sharedProductsLength > 0) ? true : false;
            },
            
            getSharedProductsBadge: function(sharedProductsLength) {
                return (sharedProductsLength === 1) ? sharedProductsLength + ' Item' : sharedProductsLength + ' Items';
            },
        }
    },

	onAfterAction: function() {

	}
    
});