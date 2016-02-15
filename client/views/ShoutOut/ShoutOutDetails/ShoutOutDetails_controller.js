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
            Meteor.subscribe('shoutoutDetails', this.params._id),
            Meteor.subscribe('myProducts')
        ];
	},
    
    data: function() {
		return {
            shout: ShoutOut.findOne(this.params._id),
            products: Products.find({}).fetch(),
            
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