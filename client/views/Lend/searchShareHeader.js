Template.searchShareHeader.rendered = function(){
    Session.set('placeholder', "Search product...");

    var inputBox = $('.search-share-header-input');

    inputBox.css({
        'width': '70%'
    });
    inputBox.focus();
};

Template.searchShareHeader.events({

    'keypress .search-share-header-input': function(e, template) {

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
            Session.set("lastSearch", key);

            //check if exist in all results cache
            if(Lend.allResultsCache[key]) {
                Session.set('scanResult', null);
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
                    Session.set('scanResult', null);
                    Session.set('allResults', result);
                    Session.set('lendTab', 'resultsCamFind');
                    PartioLoad.hide();
                    $(".modal").css("background-image", "");

                  }
                });
            }
        }
    }

});

Template.searchShareHeader.helpers({
    placeholder: function() {
        return Session.get('placeholder');
    },
    lastSearch: function(){
      return Session.get('lastSearch');
    }
})


function resetImageCamFind(){
  $(".modal").css("background-image", "");
  $("#cam-find").show();
  $(".item-input-inset").slideDown();
}
