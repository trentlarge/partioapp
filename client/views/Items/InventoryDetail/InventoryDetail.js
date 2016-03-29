// APP LAYOUT

Template.appLayout.events({
	'click #editCurrent': function() {
		var ConnectionObj = Connections.findOne({'productData._id': this.product._id});
		if(ConnectionObj){
			var ConnectionStatus = ConnectionObj.state;
			if(ConnectionStatus != "RETURNED"){
				IonPopup.show({
					title: 'Item Borrowed',
					template: 'It is not possible edit a borrowed item.',
					buttons:
					[{
						text: 'OK',
						type: 'button-assertive',
						onTap: function()
						{
							IonPopup.close();
						}
					}]
				});

				return false;
			}
		}

		Session.set('editMode', true);
	},
});

// EDIT IMAGES MODAL

Template.inventoryEditImages.rendered = function() {

	$('.dragabble-images-box').sortable({
		revert: true,
		axis: "y",
		stop: function() {

			var slideElements = [];

			$.each($('.dragabble-image-item'), function(index, dragImage) {
				var image = $(dragImage).find('img').attr('src');
				slideElements.push({photo: image})
			});

			Session.set('slideElementsCache', slideElements);
		}
	});

	Session.set('slideElementsCache', Session.get('slideElements'));
}

Template.inventoryEditImages.destroyed = function() {
	Session.set('slideElementsCache', null);
}

Template.inventoryEditImages.helpers({
	slideElements: function() {
		return Session.get('slideElements');
	},
	isMaxImages: function() {
		if(Session.get('slideElementsCache')) {
			return (Session.get('slideElementsCache').length >= 5) ? true : false;
		}
	},
	isMinImages: function() {
		if(Session.get('slideElementsCache')) {
			return (Session.get('slideElementsCache').length >= 2) ? true : false;
		}
	},
});

Template.inventoryEditImages.events({

	'click .close': function(e, template) {
		var slideElements = Session.get('slideElementsCache');
		var dragImage = $(e.target).parent('li');
		var index = dragImage.index();
		slideElements.splice(index, 1);
		Session.set('slideElementsCache', slideElements);

		dragImage.remove();

		$('#browser-file-upload').val('');
	},

	'change #browser-file-upload': function(input) {

		var slideElements = Session.get('slideElementsCache');
		var FR = new FileReader();
		FR.onload = function(e) {
			var newImage = e.target.result;
			slideElements.push({'photo': newImage});
			Session.set('slideElementsCache', slideElements);

			$('.dragabble-images-box').append(
				'<li class="dragabble-image-item">' +
				'<div class="close">&times;</div>' +
				'<span class="cover">COVER</span>' +
				'<img class="dragabble-image" src="' + newImage + '"/>' +
				'</li>'
			);
		};
		FR.readAsDataURL(input.target.files[0]);
	},

	'click .select-image': function(event, template) {
		IonActionSheet.show({
			buttons: [
				{ text: 'Take Photo' },
				{ text: 'Choose from Library' },
			],
			cancelText: 'Cancel',

			cancel: function() {
				//        IonActionSheet.close();
			},
			buttonClicked: function(index) {
				var options = {
					width: 577,
					height: 1024,
					quality: 75,
					sourceType: 1
				};

				if(Meteor.isCordova || index == 0) {
					if(Meteor.isCordova) {
						if(index == 1) {
							options.sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
						} else {
							options.sourceType = Camera.PictureSourceType.CAMERA;
						}
					}

					MeteorCamera.getPicture(options, function(err, data) {
						if(err) {
							IonPopup.show({
								title: 'Get picture',
								template: '<div class="center dark">Sorry, canot get picture.</div>',
								buttons:
								[{
									text: 'OK',
									type: 'button-energized',
									onTap: function() {
										IonPopup.close();
									}
								}]
							});
							return false;
						}

						var slideElements = Session.get('slideElementsCache');
						slideElements.push({'photo': data});
						Session.set('slideElementsCache', slideElements);

						$('.dragabble-images-box').append(
							'<li class="dragabble-image-item">' +
							'<div class="close">&times;</div>' +
							'<span class="cover">COVER</span>' +
							'<img class="dragabble-image" src="' + data + '"/>' +
							'</li>'
						);

					});
				} else {
					$('#browser-file-upload').click();
				}

				return true;
			}
		});
	},

	'click #saveImages': function() {

		var images = Session.get('slideElementsCache');
		if(images.length == 0) {
			$('.product-image').attr('src', base64imgs('image-not-available'));
		}
		else {
			$('.product-image').attr('src', images[0].photo);
		}

		Session.set('slideElements', images);
		$('.modal .bar button').click();
	},

	'click #cancelImages': function() {
		$('.modal .bar button').click();
	}

});

// SLIDE IMAGES MODAL

Template.slideInventoryImages.helpers({
	slideElements: function() {
		return Session.get('slideElements');
	}
});

// INVENTORY DETAILS

Template.inventoryDetail.rendered = function() {

	var product = this.data.product;
	var slideElements = [];
	if(product) {
		if(product.images) {
			$.each(product.images, function(index, image) {
				slideElements.push(image);
			});
			Session.set('slideElements', slideElements);
		}
		else {
			slideElements.push({'photo': product.image});
			Session.set('slideElements', slideElements);
		}
	}
}

Template.inventoryDetail.destroyed = function () {
	Session.set('slideElements', null);
	Session.set('productId', null);
	Session.set('view', null);
	Session.set('location', null);
};

Template.inventoryDetail.onCreated(function () {
	Meteor.subscribe("singleProduct", Router.current().params._id)
});

Template.inventoryDetail.events({

	'change .toggle-location input[type=checkbox]': function(e) {
        if(!e.currentTarget.checked) {
            Session.set('view', false);
            IonModal.open('itemLocationMap');
            $('.locationSwitch').text('NEW LOCATION')
        } else {
            getCurrentLocation();
            $('.locationSwitch').text('DEFAULT LOCATION')
        }
    },

    'click .locationSwitch': function(e, template) {
        if($('.locationSwitch').text() === 'DEFAULT LOCATION') {
            Session.set('view', true);
        }
		else {
			Session.set('view', false);
		}
		
		IonModal.open('itemLocationMap');
    },

	'click .locationDisabled': function(e, template) {
		Session.set('view', true);
		IonModal.open('itemLocationMap');

		if(Session.get('location')) {
			IonModal.open('itemLocationMap');
		}
	},

	'click .features': function(e, template) {
		var features = $('.features');
		var featureDetails = $('.features-details');

		if(!featureDetails.is(':visible')){
			featureDetails.slideDown('fast');
			features.find('.chevron-icon').removeClass('ion-chevron-up').addClass('ion-chevron-down');
		} else {
			featureDetails.slideUp('fast');
			features.find('.chevron-icon').removeClass('ion-chevron-down').addClass('ion-chevron-up');
		}
	},

	'click #editSave': function(e, template) {

		var self = this;

		var dayPrice = parseFloat(template.find('.dayPrice').value, 10) || 0,
			weekPrice = parseFloat(template.find('.weekPrice').value, 10) || 0,
			monthPrice = parseFloat(template.find('.monthPrice').value, 10) || 0,
			semesterPrice = parseFloat(template.find('.semesterPrice').value, 10) || 0;

			sellingPrice = parseFloat(template.find('.sellingPrice').value, 10) || 0,

			lowerValue = 1,
			highestValue = 100000,

			conditionId = template.find('.condition').value,
			title = template.find('.title').value,

			editedPrices = {
				"day": Number(dayPrice).toFixed(2),
				"week": Number(weekPrice).toFixed(2),
				"month": Number(monthPrice).toFixed(2),
				"semester": Number(semesterPrice).toFixed(2),
				"status": $('.enableRent').text()
			},

			selling = {
				"price": Number(sellingPrice).toFixed(2),
				"status": $('.enablePurchasing').text()
			},

			category = template.find('.category').value,
			images = Session.get('slideElements'),

			product = {
				'title': title,
				'category': category,
				'conditionId': conditionId,
				'rentPrice': editedPrices,
				'selling': selling
			};

		if(Session.get('location')) {
			product.location = Session.get('location');
		}

		// check title
		if(title.length == 0) {
			showInvalidPopUp('Invalid Inputs', 'Please enter a Title');
			return false;
		}

		// check condition
		if(conditionId == 0) {
			showInvalidPopUp('Invalid Inputs', 'Please enter a Condition');
			return false;
		}

		// check rent price
		if(editedPrices.status === 'ON') {

			if(dayPrice < lowerValue || weekPrice < lowerValue || monthPrice < lowerValue || semesterPrice < lowerValue){
				showInvalidPopUp('Invalid Inputs', 'Please enter a valid rent price.');
				return false;
			}

			if(dayPrice > highestValue || weekPrice > highestValue || monthPrice > highestValue|| semesterPrice > highestValue){
				showInvalidPopUp('Invalid Inputs', 'Please enter a price less than 100000.');
				return false;
			}

		}

		// check selling price
		if(selling.status === 'ON' && (sellingPrice < lowerValue || sellingPrice >= highestValue*10)) {
			showInvalidPopUp('Invalid Inputs', 'Please enter a valid selling price.');
			return false;
		}

		// set prices
		template.find('.dayPrice').value = editedPrices.day;
		template.find('.weekPrice').value = editedPrices.week;
		template.find('.monthPrice').value = editedPrices.month;
		template.find('.semesterPrice').value = editedPrices.semester;

		template.find('.sellingPrice').value = selling.price;

		// set product images
		if(images.length == 0) {
			product.image = base64imgs('image-not-available');
		}
		else {
			product.image = images[0].photo;
			product.images = images;
		}

		//update product
		Meteor.call("updateProduct", self.product._id, product, function(err, res) {
			if(err) {
				var errorMessage = err.reason || err.message;
				if(err.details) {
					errorMessage = errorMessage + "\nDetails:\n" + err.details;
				}
				sAlert.error(errorMessage);
				return;
			}
		});

		Session.set('editMode', false);
	},

	'click #editCancel': function(e, template) {
		Session.set('editMode', false);
		Router.go('/items');
	},

	'click #editRemove': function(e, template) {
		var productId = this.product._id;

		IonPopup.show({
			title: 'Remove product?',
			template: 'Remove product from your invetory?',
			buttons:
			[
				{
					text: 'Cancel',
					type: 'button-default',
					onTap: function()
					{
						IonPopup.close();
					}
				},
				{
					text: 'Remove',
					type: 'button-assertive',
					onTap: function()
					{
						Meteor.call('removeProduct', productId, function() {
							IonPopup.close();
							Session.set('editMode', false);
							Router.go('/items');
						});
					}
				},
			]
		});
	},

	'click .toggle-purchasing': function(e, template) {
        if($('.enablePurchasing').text() === 'OFF') {
            $('.enablePurchasing').text('ON');
			$('.item-sell-price').show();
        }
        else {
            $('.enablePurchasing').text('OFF');
			$('.item-sell-price').hide();
        }
    },

    'click .toggle-rent': function(e, template) {
        if($('.enableRent').text() === 'OFF') {
            $('.enableRent').text('ON');
			$('.item-rent-prices').show();
        }
        else {
            $('.enableRent').text('OFF');
			$('.item-rent-prices').hide();
        }
    },

});

function getCurrentLocation() {

    var user = Meteor.user();

    if(user && user.profile.location) {
        Session.set('location', user.profile.location);
    }
    else {
        checkUserLocation(function(location){
            location.point = [location.lat, location.lng];
            Session.set('location', location);

            var updatedProfile = {
                location: location
            }

            Meteor.call("updateUserProfile", updatedProfile, function(err, res) {

                if(err) {
                    var errorMessage = err.reason || err.message;
                    if(err.details) {
                        errorMessage = errorMessage + "\nDetails:\n" + err.details;
                    }
                    sAlert.error(errorMessage);
                    return;
                }
            });

        });
    }
}

function showInvalidPopUp(strTitle, strMessage){
	IonPopup.show({
		title: strTitle,
		template: strMessage,
		buttons:
		[{
			text: 'OK',
			type: 'button-assertive',
			onTap: function()
			{
				IonPopup.close();
			}
		}]
	});
}
