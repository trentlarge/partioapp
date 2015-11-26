app = app || {};

app.model.PartioLoad = (function () {
 'use strict';
  var PartioLoad = {
    show: function(message) {
      Session.set('partioLoadMsg', '');

      if(message) {
        PartioLoad.setMessage(message);
      }

      var _loadTemplate = '<img src="https://testepartio.s3.amazonaws.com/circle.png" class="logo-spinner" >';

      if(Session.get('partioLoadMsg') != ''){
        _loadTemplate += "<div class='message'>"+Session.get('partioLoadMsg')+"</div>";
      }

      IonLoading.show({customTemplate: _loadTemplate });
    },

    hide: function(){
      IonLoading.hide();
      Session.set('partioLoadMsg', '');
    },

    setMessage: function(message){
      Session.set('partioLoadMsg', message);
    }
  }
  return PartioLoad;
})

PartioLoad = new app.model.PartioLoad();
