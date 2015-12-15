Template.resultsDetails.helpers({
    getTitle: function() {
        return this.title;
    },
    scanResult: function() {
        return Session.get('scanResult');
    },
    isDifferentCategory: function() {
        if(this.index === 0 || Lend.currentCategory !== this.amazonCategory) {
            Lend.currentCategory = this.amazonCategory;
            return true;
        }
        return false;
    },
    splitCategory: function() {
        if(this.amazonCategory){
            return this.amazonCategory.replace(/\s/g,"").replace(/\&/g,"");
        }
        return false;
    },
    getCategoryIcon: function() {
        return Categories.getCategoryIconByText(this.category);
    },
    getConditions: function() {
        return Rating.getConditions();
    },
    isOnlyOneCategory: function() {

        if(Session.get('isOnlyOneCategory'))  {
            return Session.get('isOnlyOneCategory');
        }
        else {
            var result = Session.get('allResults');

            var currentCategory = '';
            var nCategory = 0;

            $.each(result, function(index, r) {
                if(r.amazonCategory !== currentCategory) {
                    currentCategory = r.amazonCategory;
                    nCategory++;
                }
            });

            if(nCategory == 1) {
                Session.set('isOnlyOneCatgory', true);
                return true;
            }
            else {
                Session.set('isOnlyOneCatgory', false);
                return false;
            }
        }

    },
    waitingForPrices: function() {
        return Lend.validatePrices() ? "": "disabled";
    },
    validatePrices: function(){
        return Lend.validatePrices();
    },
    calculatedPriceDay: function() {

        var scanResult = Session.get('scanResult');

        if (scanResult) {
            if (scanResult.price !== "--") {

                var priceValueDay = (scanResult.price).split("$")[1];
                var price = Lend.calculatePrice('ONE_DAY', priceValueDay);

                if(price > 0) {
                    Session.set('dayPrice', price);
                    return price;
                }
            }
        }
    },

    calculatedPriceWeek: function() {

        var scanResult = Session.get('scanResult');

        if (scanResult) {
            if (scanResult.price !== "--") {
                var priceValueWeek = (scanResult.price).split("$")[1];
                var price = Lend.calculatePrice('ONE_WEEK', priceValueWeek);

                if(price > 0) {
                    Session.set('weekPrice', price);
                    return price;
                }
            }
        }

    },

    calculatedPriceMonth: function() {

        var scanResult = Session.get('scanResult');

        if (scanResult) {
            if (scanResult.price !== "--") {

                var priceValueMonth = (scanResult.price).split("$")[1];
                var price = Lend.calculatePrice('ONE_MONTH', priceValueMonth);

                if(price > 0) {
                    Session.set('monthPrice', price);
                    return price;
                }
            }
        }
    },

    calculatedPrice4Months: function() {

        var scanResult = Session.get('scanResult');

        if (scanResult) {
            if (scanResult.price !== "--") {
                var priceValue4Months = (scanResult.price).split("$")[1];
                var price = Lend.calculatePrice('FOUR_MONTHS', priceValue4Months);

                if(price > 0) {
                    Session.set('semesterPrice', price);
                    return price;
                }
            }
        }
    },
});

Template.resultsDetails.events({

    'focus input': function() {
        $('.results-details-content').css({
            'padding-bottom': '200px'
        });
    },

    'focusout input': function() {
        $('.results-details-content').css({
            'padding-bottom': '0'
        });
    },    
    
    'click .features': function(e, template) {

      var features = $('.features');
      var featureDetails = $('.features-details');

        if(!featureDetails.is(':visible')){
            featureDetails.slideDown('fast');
            features.find('.chevron-icon').removeClass('ion-chevron-up').addClass('ion-chevron-down');
        }
        else {
            featureDetails.slideUp('fast');
            features.find('.chevron-icon').removeClass('ion-chevron-down').addClass('ion-chevron-up');
        }

    },
    'change .userPrice': function(e, template){

        var rentPrice = {
            "day": template.find('.dayPrice').value,
            "week": template.find('.weekPrice').value,
            "month": template.find('.monthPrice').value,
            "semester": template.find('.semesterPrice').value,
         }

          Session.set('dayPrice', rentPrice.day);
          Session.set('weekPrice', rentPrice.week);
          Session.set('monthPrice', rentPrice.month);
          Session.set('semesterPrice', rentPrice.semester);

    },

    'click .submitProduct': function(e, template) {

        var currentUser = Meteor.user();

        if(!currentUser || !currentUser.profile || !currentUser.profile.canShare) {
          IonPopup.show({
            title: 'Update profile',
            template: '<div class="center">Please, update your debit card to share this item.</div>',
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
        }

        if(Lend.validatePrices()) {

            var submitProduct = Session.get('scanResult');
            var product = _.extend(submitProduct,
            {
                "title": $('.productTitle').val(),
                "ownerId": Meteor.userId(),
                'searchId': null,
                "conditionId": $('.fieldConditionLend').val(),
                "rentPrice": {
                    "day": Number(Session.get('dayPrice')).toFixed(2),
                    "week": Number(Session.get('weekPrice')).toFixed(2),
                    "month": Number(Session.get('monthPrice')).toFixed(2),
                    "semester": Number(Session.get('semesterPrice')).toFixed(2)
                }
            });

            if(!validateInputs(product)){
                PartioLoad.hide();
                return;
            }

            Lend.addProductToInventory(product);
            Lend.latestProduct = undefined;

        }

    }

});

function validateInputs(details){
  if(!details.title || details.title.length < 1) {
    showInvalidPopUp('Invalid Inputs', 'Please enter a valid Title.');
    return false;
  }

  if(!details.conditionId || details.conditionId < 1) {
    showInvalidPopUp('Invalid Inputs', 'Please enter a valid Condition of the item.');
    return false;
  }

  return true;
}

function showInvalidPopUp(strTitle, strMessage){
  IonPopup.show({
    title: strTitle,
    template: '<div class="center">'+strMessage+'</div>',
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
