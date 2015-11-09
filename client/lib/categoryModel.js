app = app || {};

app.model.Categories = (function () {
   'use strict';

   var Categories = function() {

       this.category;
       
   };

   Categories = {

        //initialize vars
        init : function() {
            
            this.category = [
               {
                   text: 'Textbooks',
                   icon: 'ion-ios-book',
               },
               {
                   text: 'Technology',
                   icon: 'ion-ios-game-controller-b',
               },
               {
                   text: 'Music',
                   icon: 'ion-headphone',
               },
               {
                   text: 'Home',
                   icon: 'ion-android-restaurant',
               },
               {
                   text: 'Sports',
                   icon: 'ion-ios-americanfootball',
               },
               {
                   text: 'Miscellaneous',
                   icon: 'ion-cube',
               }
           ]
            
        },
       
        //get category by index;
        getCategory(index) {
            return this.category[index].text;
        },
       
        //get category icon by index
        getCategoryIcon(index) {
             return this.category[index].icon;
        },
       
        getCategoryIndexByText(categoryText) {
       
            var categoryIndex;
            
            $.each(this.category, function(index, category) {
                
                if(category.text === categoryText) {
                    categoryIndex = index;
                }
                
            })
            
            return categoryIndex;
        }

   };

   return Categories;
});

Categories = new app.model.Categories();
Categories.init();
