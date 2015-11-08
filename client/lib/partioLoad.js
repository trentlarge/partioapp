app = app || {};

app.model.PartioLoad = (function () {
 'use strict';
  var PartioLoad = {
    show: function() {
      IonLoading.show({customTemplate: '<img src="circle.png" class="logo-spinner" >'});
    },

    hide: function(){
      IonLoading.hide();
    }
  }
  return PartioLoad;
})

PartioLoad = new app.model.PartioLoad();
