Template.searchShareHeader.rendered = function(){
    Session.set('placeholder', "Search product..");
};

Template.searchShareHeader.events({
    
    'click .search-share-header-icon': function(e, template){
        
        var inputBox = $('.search-share-header-input');
        var submitSearch = $('.submit-search');
        
        console.log(inputBox.css('width'));
        
        if(inputBox.css('width') === '0px' || inputBox.css('width') === '0%'){
            inputBox.css({
                'width':'50%',
                'padding': '15px'
            });
            inputBox.focus();
            submitSearch.show();
        } else {
            inputBox.css({
                'width':'0%',
                'padding': '0'
            });
            inputBox.focusout();
            inputBox.val('');
            submitSearch.hide();
        }
        
    },
    
    'click .submit-search': function(e, template) {
        
        console.log('test');
        
        //reset sessions
        Session.set('scanResult', null);
        Session.set('lendTab', 'camfind');

        PartioLoad.show();

        //get keywords
        var key = template.find('.search-share-header-input').value;
//        Session.set("lastSearchCamFind", key);

        //check if exist in all results cache
        if(Lend.allResultsCache[key]) {
            Session.set('allResults', Lend.allResultsCache[key]);
            Session.set('lendTab', 'resultsCamFind');
            PartioLoad.hide();
            $(".modal").css("background-image", "");
            Lend.latestProduct = key;
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
                Session.set('lendTab', 'resultsCamFind');
                PartioLoad.hide();
                $(".modal").css("background-image", "");

              }
            });
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
