Template.manual.rendered = function() {

    if(IonSideMenu && IonSideMenu.snapper) {
        IonSideMenu.snapper.settings({touchToDrag: false});
    }

    Session.set('rent', true);
    Session.set('purchasing', false);

    Session.set('allResults', null);

    if(Session.get('lendTab') === 'resultDetails') {
        $('.manual-entry').css({'margin-bottom': '0'});
    }

    var shareProduct = Session.get('shareProduct');

    if(shareProduct) {
        Session.set('photoTaken', shareProduct.image);
        Session.set('manualTitle', shareProduct.title);
        Session.set('selectedCategory', shareProduct.category);
        Session.set('dayPrice', shareProduct.price.day);
        Session.set('weekPrice', shareProduct.price.week);
        Session.set('monthPrice', shareProduct.price.month);
        Session.set('semesterPrice', shareProduct.price.semester);
    } else {
        Session.set('manualTitle', null);
        Session.set('dayPrice', null);
        Session.set('weekPrice', null);
        Session.set('monthPrice', null);
        Session.set('semesterPrice', null);
        Session.set('sellingPrice', null);
        Session.set('photoTaken', null);
    }

    //check card back
    var manualProduct = Session.get('cardManualEntry');

    if(manualProduct) {
        var slideElements = [];
        for(var i=0; i<5; i++) {
            if(manualProduct.images[i]) {
                slideElements.push({photo: manualProduct.images[i]});
            }
        }
        Session.get('slideElements', slideElements);
        Session.set('manualTitle', manualProduct.title);
        Session.set('selectedCategory', manualProduct.category);
        Session.set('selectedCondition', manualProduct.conditionId);
        Session.set('dayPrice', manualProduct.rentPrice.day);
        Session.set('weekPrice', manualProduct.rentPrice.week);
        Session.set('monthPrice', manualProduct.rentPrice.month);
        Session.set('semesterPrice', manualProduct.rentPrice.semester);
    }

    $('.darken-element').css({'opacity': '1'});
    $('.view').css({'background': '#eceff1'});

    $('.search-share-header-input').removeClass('has-text');

    if(Session.get('photoTaken') && Session.get('slideElements')) {
        var slideElements = Session.get('slideElements');
        slideElements[0].photo = Session.get('photoTaken');
        Session.set('slideElements', slideElements);
    }

}

Template.manual.destroyed = function() {

    IonSideMenu.snapper.settings({touchToDrag: true});

    Session.set('shareProduct', null);
    Session.set('photoTaken', null);
    Session.set('slideElements', null);
    Session.set('camfindImage', null);
    Session.set('selectedCategory', null);
    Session.set('selectedCondition', null);
    Session.set('location', null);

    Session.set('rent', null);
    Session.set('purchasing', null);
}

Template.manual.helpers({
    photoTaken: function() {
        return Session.get('photoTaken');
    },
    hasPhoto: function(index) {
        var slideElements = Session.get('slideElements');
        return (slideElements[index].photo !== '') ? true : false;
    },
    getCategories: function() {
        return Categories.getCategories();
    },
    selectedCategory: function(category) {
        return (category === Session.get('selectedCategory')) ? 'selected' : '';
    },
    selectedCondition: function(index) {
        return (index == Session.get('selectedCondition')) ? 'selected' : '';
    },
    getConditions: function() {
        return Rating.getConditions();
    },
    waitingForPrices: function() {
        if(Session.get('purchasing')) {
            return Lend.validatePurchasingPrice() ? "": "disabled";
        }
        if(Session.get('rent')) {
            return Lend.validatePrices() ? "": "disabled";
        }
        return "";
    },
    validatePrices: function(){
        if(Session.get('purchasing')) {
            return Lend.validatePurchasingPrice();
        }
        if(Session.get('rent')) {
            return Lend.validatePrices();
        }
        return true;
    },
    manualTitle: function() {
        return Session.get('manualTitle');
    },
    dayPrice: function(){
        return Session.get('dayPrice');
    },
    weekPrice: function(){
        return Session.get('weekPrice');
    },
    monthPrice: function(){
        return Session.get('monthPrice');
    },
    semesterPrice: function(){
        return Session.get('semesterPrice');
    },
    sellingPrice: function() {
        return Session.get('sellingPrice');
    },
    slideElements: function() {

        if(!Session.get('slideElements')) {
            var slideElements = [];
            for(var i=0; i<5; i++) {
                slideElements.push({photo: ''});
            }
            Session.set('slideElements', slideElements);
        }
        return Session.get('slideElements');
    }
})

Template.manual.events({

    'click .toggle-purchasing': function(e, template) {
        if($('.enablePurchasing').text() === 'OFF') {
            $('.enablePurchasing').text('ON');
            $('.item-sell-price').show();
            Session.set('purchasing', true);
        }
        else {
            $('.enablePurchasing').text('OFF');
            $('.item-sell-price').hide();
            Session.set('purchasing', false);
        }
    },

    'click .toggle-rent': function(e, template) {
        if($('.enableRent').text() === 'OFF') {
            $('.enableRent').text('ON');
            $('.item-rent-prices').show();
            Session.set('rent', true);
        }
        else {
            $('.enableRent').text('OFF');
            $('.item-rent-prices').hide();
            Session.set('rent', false);
        }
    },

    'change .userPrice': function(e, template) {
        var rentPrice = {
            "day": template.find('.dayPrice').value,
            "week": template.find('.weekPrice').value,
            "month": template.find('.monthPrice').value,
            "semester": template.find('.semesterPrice').value,
        }

        var sellingPrice = template.find('.sellingPrice').value;

        Session.set('dayPrice', rentPrice.day);
        Session.set('weekPrice', rentPrice.week);
        Session.set('monthPrice', rentPrice.month);
        Session.set('semesterPrice', rentPrice.semester);

        Session.set('sellingPrice', sellingPrice);
    },

    'click .close': function(e, template) {
        //      Session.set("photoTaken", null);
        var slideElements = Session.get('slideElements');
        var index = $('.slick-active').attr('data-slick-index');
        slideElements[index].photo = '';
        Session.set('slideElements', slideElements);

        $('#browser-file-upload').val('');
    },

    'change #browser-file-upload': function(input) {

        var slideElements = Session.get('slideElements');
        var FR = new FileReader();
        FR.onload = function(e) {
            var newImage = e.target.result;

            var index = $('.slick-active').attr('data-slick-index');
            slideElements[index].photo = newImage;
            Session.set('slideElements', slideElements);

            //Session.set("photoTaken", newImage);
        };
        FR.readAsDataURL(input.target.files[0]);
    },

    'click .scanResult-thumbnail2': function(event, template) {
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

                        var slideElements = Session.get('slideElements');
                        var index = $('.slick-active').attr('data-slick-index');
                        slideElements[index].photo = data;
                        Session.set('slideElements', slideElements);

                        //              Session.set("photoTaken", data);
                    });
                } else {
                    $('#browser-file-upload').click();
                }

                return true;
            }
        });
    },

    'click .calculate-prices': function() {

        //get keywords
        var key = $('.manualTitle').val();

        if(key === '') {
            IonPopup.show({
                title: 'Ops...',
                template: 'Please add a valid title.',
                buttons:
                [{
                    text: 'OK',
                    type: 'button-energized',
                    onTap: function() {
                        IonPopup.close();
                    }
                }]
            });

            return;
        }

        PartioLoad.show('Calculating prices...');

        //check if exist in all results cache
        if(Lend.allResultsCache[key]) {

            setResultPrices(Lend.allResultsCache[key]);

            Lend.latestProduct = key;
            PartioLoad.hide();

        }
        else {
            Meteor.call('AllItemsFromAmazon', key, function(error, result) {
                if(error && !result) {
                    PartioLoad.hide();

                    IonPopup.show({
                        title: 'Ops...',
                        template: error.message,
                        buttons:
                        [{
                            text: 'OK',
                            type: 'button-energized',
                            onTap: function() {
                                IonPopup.close();
                            }
                        }]
                    });
                } else {

                    //add on cache
                    Lend.allResultsCache[key] = result;
                    Lend.latestProduct = key;

                    setResultPrices(result);

                    PartioLoad.hide();

                }
            });
        }


    },

    'click .submitProduct': function(e, template) {

        PartioLoad.show();

        var amazonProduct = Session.get('amazonProduct');

        var images = (function() {
            var images = [];
            if(Session.get('slideElements')) {
                var slideElements = Session.get('slideElements');
                $.each(slideElements, function(index, slideElement) {
                    if(slideElement.photo !== '') {
                        images.push(slideElement);
                    }
                })
            }
            return images;
        })();

        var product = {
            "title": $('.manualTitle').val().toLowerCase().replace(/\b[a-z]/g, function(letter) {
                return letter.toUpperCase();
            }),
            "price": '--',
            "conditionId": $('.manualCondition').val(),
            "ownerId": Meteor.userId(),
            "location": Session.get('location'),
            //"ownerArea": Meteor.user().profile.area,
            "category": $('.manualCategory').val(),
            "amazonCategory": $('.manualCategory').val(),
            "image": (function() {
                if(images[0]) {
                    return images[0].photo;
                } else {
                    return base64imgs('image-not-available');
                }
            })(),
            "images": images,
            "rentPrice": {
                "day": Number(Session.get('dayPrice')).toFixed(2) || Number(0.00).toFixed(2),
                "week": Number(Session.get('weekPrice')).toFixed(2) || Number(0.00).toFixed(2),
                "month": Number(Session.get('monthPrice')).toFixed(2) || Number(0.00).toFixed(2),
                "semester": Number(Session.get('semesterPrice')).toFixed(2) || Number(0.00).toFixed(2),
                "status": $('.enableRent').text()
            },
            "selling": {
                "price": Number(Session.get('sellingPrice')).toFixed(2) || Number(0.00).toFixed(2),
                "status": $('.enablePurchasing').text()
            }
        }

        if(amazonProduct) {
            product.price = amazonProduct.price;
            product.amazonCategory = amazonProduct.amazonCategory;
        }

        Meteor.call('userCanShare', function(error, result){
            PartioLoad.hide();

            if(!result) {
                Session.set('cardManualEntry', product);

                IonPopup.show({
                    title: 'Update profile',
                    template: 'Please, update your debit card to share this item.',
                    buttons: [{
                        text: 'OK',
                        type: 'button-energized',
                        onTap: function() {
                            IonPopup.close();
                            Router.go('/profile/savedcards/');
                        }
                    }]
                });
                return false;

            } else {
                if(!validateInputs(product)){
                    PartioLoad.hide();
                    return false;
                }

                Lend.addProductToInventory(product);
                Lend.latestProduct = undefined;

            }
        });

    },

});


function setResultPrices(results) {

    var resultsLenght = 0,
        averagePrice = 0.0;

    //get category from number of occurrences
    $.each(results, function(index, result) {

        if(result.price !== '--') {
            var price = Number(result.price.replace(/[^0-9\.-]+/g,""));

            if(price > 0) {
                averagePrice += price;
                resultsLenght++;
            }
        }
    })

    //get average price from results
    var averageFinalPrice = (averagePrice/resultsLenght).toFixed(2);

    var price = {
        'averagePrice' : averageFinalPrice,
        'day' : Lend.calculatePrice('ONE_DAY', averageFinalPrice),
        'week' : Lend.calculatePrice('ONE_WEEK', averageFinalPrice),
        'month' : Lend.calculatePrice('ONE_MONTH', averageFinalPrice),
        'semester' : Lend.calculatePrice('FOUR_MONTHS', averageFinalPrice)
    }

    Session.set('dayPrice', price.day);
    Session.set('weekPrice', price.week);
    Session.set('monthPrice', price.month);
    Session.set('semesterPrice', price.semester);

}

function validateInputs(product) {
    if(!product.title || product.title.length < 1) {
        showInvalidPopUp('Invalid Inputs', 'Please enter a valid Title.');
        return false;
    }

    if(!product.conditionId || product.conditionId < 1) {
        showInvalidPopUp('Invalid Inputs', 'Please enter a valid Condition of the item.');
        return false;
    }

    return true;
}

function showInvalidPopUp(strTitle, strMessage) {
    IonPopup.show({
        title: strTitle,
        template: strMessage,
        buttons:
        [{
            text: 'OK',
            type: 'button-energized',
            onTap: function()
            {
                IonPopup.close();
            }
        }]
    });
}
