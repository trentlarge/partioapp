Template.manual.rendered = function() {

    IonSideMenu.snapper.settings({touchToDrag: false});
    Session.set('rent', true);
    Session.set('purchasing', false);

    var itemNotFound = Session.get('itemNotFound');

    if(itemNotFound) {
        Session.set('photoTaken', itemNotFound.image);
        Session.set('manualTitle', itemNotFound.title);
        Session.set('selectedCategory', itemNotFound.category);
        Session.set('dayPrice', itemNotFound.price.day);
        Session.set('weekPrice', itemNotFound.price.week);
        Session.set('monthPrice', itemNotFound.price.month);
        Session.set('semesterPrice', itemNotFound.price.semester);
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
        //      Session.set('photoTaken', manualProduct.image);
        Session.set('manualTitle', manualProduct.title);
        Session.set('selectedCategory', manualProduct.category);
        Session.set('selectedCondition', manualProduct.conditionId);
        Session.set('dayPrice', manualProduct.rentPrice.day);
        Session.set('weekPrice', manualProduct.rentPrice.week);
        Session.set('monthPrice', manualProduct.rentPrice.month);
        Session.set('semesterPrice', manualProduct.rentPrice.semester);
    }

    Session.set('scanResult', null);
    Session.set('allResults', null);

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

    Session.set('itemNotFound', null);
    Session.set('photoTaken', null);
    Session.set('slideElements', null);
    Session.set('camfindImage', null);
    Session.set('selectedCategory', null);
    Session.set('selectedCondition', null);

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

    'click .toggle-purchasing': function(e, template) {
        if($('.enablePurchasing').text() === 'OFF') {
            $('.enablePurchasing').text('ON');
            Session.set('purchasing', true);
        }
        else {
            $('.enablePurchasing').text('OFF');
            Session.set('purchasing', false);
        }
    },

    'click .toggle-rent': function(e, template) {
        if($('.enableRent').text() === 'OFF') {
            $('.enableRent').text('ON');
            Session.set('rent', true);
        }
        else {
            $('.enableRent').text('OFF');
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


    }

});


function setResultPrices(results) {

    var resultsLenght = 0;
    var averagePrice = 0.0;

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
