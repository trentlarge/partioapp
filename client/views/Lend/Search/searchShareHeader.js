Template.searchShareHeader.rendered = function(){
    Session.set('placeholder', "Search product...");

    var inputBox = $('.search-share-header-input');

    inputBox.css({
        'width': '100%'
    });
    inputBox.focus();
    
    //if back button is clicked, trigger enter button on search bar with latest product
    if(Lend.latestProduct) {
        inputBox.val(Lend.latestProduct);
        inputBox.trigger({type: 'keypress', charCode: 13});
    }

};

Template.searchShareHeader.destroyed = function() {
    if(!Session.get('scanResult')) {
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
            }
            else {
                PartioLoad.show('Searching barcode...');
            }

            //get keywords
            var key = template.find('.search-share-header-input').value;

            //check if exist in all results cache
            if(Lend.allResultsCache[key]) {

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
                            template: '<div class="center">'+ error.message + '</div>',
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

                        $.each(result, function(index, r) {
                            result[index].index = index;
                        });

                        //add on cache
                        Lend.allResultsCache[key] = result;
                        Lend.latestProduct = key;
                        
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


function resetImageCamFind(){
  $(".modal").css("background-image", "");
  $("#cam-find").show();
  $(".item-input-inset").slideDown();
}
