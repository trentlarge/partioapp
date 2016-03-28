Template.searchShareHeader.rendered = function(){
    Session.set('placeholder', "Search product...");

    var inputBox = $('.search-share-header-input');

    inputBox.css({
        'width': '100%'
    });
//    inputBox.focus();

    //if back button is clicked, trigger enter button on search bar with latest product
    if(Lend.latestProduct) {
        inputBox.val(Lend.latestProduct);
        inputBox.trigger({type: 'keypress', charCode: 13});
    }

};

Template.searchShareHeader.destroyed = function() {
    if(Session.get('lendTab') !== 'resultDetails') {
        Lend.latestProduct = undefined;
    }
};

Template.searchShareHeader.events({

    'focusout .search-share-header-input': function(e, template) {

        if(Session.get('allResults')) {
            var inputSearch = $('.search-share-header-input');

            if(inputSearch.val().length > 0) {
                inputSearch.addClass('has-text');
            }

            $('.darken-element').css({'opacity': '1'}, function() {
                $('.view').css({'background': '#eceff1'});
            });

        }

    },
    'focus .search-share-header-input': function(e, template) {
        $('.search-share-header-input').removeClass('has-text');

        if(Session.get('allResults')) {
            $('.view').css({'background': '#000000'});
            $('.darken-element').css({'opacity': '.5'});
        }
    },
    'keypress .search-share-header-input': function(e, template) {

        if(Session.get('allResults')) {
            $('.darken-element').css({'opacity': '1'}, function() {
                $('.view').css({'background': '#eceff1'});
            });
        }

        if (e.charCode == 13 || e.keyCode == 13) {
            //reset sessions
            Session.set('scanResult', null);
            Session.set('allResults', null);

            if(Session.get('lendTab') !== 'barcode') {
                Session.set('lendTab', 'camfind');
                PartioLoad.show('Searching similar products...');
//                PartioLoad.show('Calculating prices...');
            }
            else {
                PartioLoad.show('Searching barcode...');
//                PartioLoad.show('Calculating prices...');
            }

            //get keywords
            var key = template.find('.search-share-header-input').value;

            //check if exist in all results cache
            if(Lend.allResultsCache[key]) {

//                callResultDetails(Lend.allResultsCache[key]);

                Session.set('allResults', Lend.allResultsCache[key]);
                Session.set('lendTab', 'results');

                Lend.latestProduct = key;

                PartioLoad.hide();
                $(".modal").css("background-image", "");

                $('.search-share-header-input').blur();

            }
            else {
                Meteor.call('AllItemsFromAmazon', key, function(error, result) {
                    if(error && !result) {
                        PartioLoad.hide();
                        resetImageCamFind();

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

//                        callResultDetails(result);

                        Session.set('allResults', result);
                        Session.set('lendTab', 'results');

                        PartioLoad.hide();
                        $(".modal").css("background-image", "");

                        $('.search-share-header-input').blur();
                    }
                });
            }
        }
    }

});

Template.searchShareHeader.helpers({
    placeholder: function() {
        return Session.get('placeholder');
    }
})


function callResultDetails(results) {

        var resultsLenght = 0;
        var averagePrice = 0.0;

        var categories = [
            {
               text: 'Textbooks',
               occurrences: 0,
            },
            {
               text: 'Technology',
               occurrences: 0,
            },
            {
               text: 'Music',
               occurrences: 0,
            },
            {
               text: 'Home',
               occurrences: 0,
            },
            {
               text: 'Sports',
               occurrences: 0,
            },
            {
               text: 'Miscellaneous',
               occurrences: 0,
            }
        ]

        //get category from number of occurrences
        $.each(results, function(index, result) {

            $.each(categories, function(key, category) {
                if(result.category === category.text) {
                    category.occurrences++;
                }
            });

            if(result.price !== '--') {
                var price = Number(result.price.replace(/[^0-9\.-]+/g,""));

                if(price > 0) {
                    averagePrice += price;
                    resultsLenght++;
                }
            }
        })

        categories.sort(function(a, b) {
            return (a.occurrences < b.occurrences) ? 1 : -1;
        });

        //get average price from results
        var averageFinalPrice = (averagePrice/resultsLenght).toFixed(2);

        var title = $('.search-share-header-input').val();
        var image = Session.get('camfindImage');
        if(Session.get('lendTab') === 'barcode') {
            title = results[0].title;
            image = results[0].image;
        }

        var shareProduct = {
            'image' : image,
            'title' : title,
            'category' : categories[0].text,
            'price' : {
                'averagePrice' : averageFinalPrice,
                'day' : Lend.calculatePrice('ONE_DAY', averageFinalPrice),
                'week' : Lend.calculatePrice('ONE_WEEK', averageFinalPrice),
                'month' : Lend.calculatePrice('ONE_MONTH', averageFinalPrice),
                'semester' : Lend.calculatePrice('FOUR_MONTHS', averageFinalPrice)
            }
        }

        Session.set('shareProduct', shareProduct);
        Session.set('lendTab', 'manual');

}

function resetImageCamFind(){
    $(".modal").css("background-image", "");
    $("#cam-find").show();
    $(".item-input-inset").slideDown();
}
