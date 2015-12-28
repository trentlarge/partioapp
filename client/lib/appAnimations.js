app = app || {};

app.model.Animations = (function () {
   'use strict';

   var Animations = function() {
   
   };

   Animations = {

        //initialize vars
        init : function() {
            
        },
       
        accordion: function(header, content) {
        
            if(!content.is(':visible')){
                content.slideDown('fast');
                header.find('.chevron-icon').removeClass('ion-chevron-up').addClass('ion-chevron-down');
            }
            else {
                content.slideUp('fast');
                header.find('.chevron-icon').removeClass('ion-chevron-down').addClass('ion-chevron-up');
            }
        
        }

   };

   return Animations;
});

Animations = new app.model.Animations();
Animations.init();
