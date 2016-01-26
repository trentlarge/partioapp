LoginController = RouteController.extend({
	onBeforeAction: function() {
		this.next();
	},

	action: function() {
		this.render();
	},

	waitOn: function() {
		return [
            Meteor.subscribe('products')
		];
	},

	data: function() {
		return {
            products: Products.find({}).fetch(),
            
            isFirst: function(index) {
                return (index === 0) ? 'active' : '';  
            },
            
            productsImage: function() {
                
                var images = [];
                
                $.each(this.products, function(index, product) {
                   
                    if(product.image !== '/image-not-available.png') {
                        images.push({
                            'image': product.image,
                            'price': product.rentPrice.week
                        });
                    }
                    
                    if(images.length >= 30) {
                        return this.shuffle(images);
                    }
                    
                });

                return this.shuffle(images);
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
