LoginController = RouteController.extend({
	onBeforeAction: function() {
		this.next();
	},

	action: function() {
		this.render();
	},

	waitOn: function() {
		return [
            Meteor.subscribe('loginProducts')
		];
	},

	data: function() {
		return {
            products: Products.find({}).fetch(),
//            products: Products.find({ sold: { $ne: true }, image: { $ne: "/image-not-available.png" } }, { sort: { _id: -1 }, limit: 32 }).fetch(),
            
            isFirst: function(index) {
                return (index === 0) ? 'active' : '';  
            },
            
            productsImage: function() {
                
                var images = [];
                
                $.each(this.products, function(index, product) {
                   
                    if(images.length < 32) {
                        images.push({
                            'image': product.image,
                            'price': product.rentPrice.week
                        });
                    }
                });
                
                images = this.shuffle(images);
                
                if(images.length < 32 && images.length > 0) {
                    
                    while(images.length < 32) {
                        var randomIndex = Math.round(Math.random() * (images.length-1));
                        images.push(images[randomIndex]);
                    } 
                }
                
                else if (images.length == 0) {
                    
                    while(images.length < 32) {
                        images.push({
                            'image': '/image-not-available.png',
                            'price': '0.00',
                        });
                    }
                }

                return images;
            },
            
            shuffle: function(array) {
                var currentIndex = array.length, temporaryValue, randomIndex;

                // While there remain elements to shuffle...
                while (0 !== currentIndex) {
                    // Pick a remaining element...
                    randomIndex = Math.floor(Math.random() * currentIndex);
                    currentIndex -= 1;

                    // And swap it with the current element.
                    temporaryValue = array[currentIndex];
                    array[currentIndex] = array[randomIndex];
                    array[randomIndex] = temporaryValue;
                }

                return array;
            }
		};
	},

	onAfterAction: function() {

	}
});
