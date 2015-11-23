app = app || {};

app.model.Rating = (function () {
   'use strict';

   var Rating = function() {

        this.conditions;

   };

   Rating = {

        //initialize vars
        init : function() {
            this.conditions = [
                {
                    index: 0,
                    value: '',
                },
                {
                    index: 1,
                    value: 'Poor',
                },
                {
                    index: 2,
                    value: 'Acceptable',
                },
                {
                    index: 3,
                    value: 'Regular',
                },
                {
                    index: 4,
                    value: 'Good',
                },
                {
                    index: 5,
                    value: 'Excellent',
                }
            ];
        },

        getConditions: function() {
            return this.conditions;
        },

        getConditionByIndex: function(index) {
            return this.conditions[index].value;
        }
   }

   return Rating;
});

Rating = new app.model.Rating();
Rating.init();
