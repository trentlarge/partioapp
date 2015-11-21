server = server || {};

server.model.Categories = (function () {

    'use strict';

    var Categories = function() {
    
        this.categories;
   
    }
   
    Categories = {
   
        init : function() {
            
            var CATEGORY1 = "Textbooks",
                CATEGORY2 = "Technology",
                CATEGORY3 = "Home",
                CATEGORY4 = "Music",
                CATEGORY5 = "Sports";
              
            this.categories = {
                //Books
                "Book" : CATEGORY1, 
                "Magazine" : CATEGORY1,
                //Technology
                "PC Accessory" : CATEGORY2, 
                "Personal Computer" : CATEGORY2,
                "Wireless" : CATEGORY2,
                "Video Games" : CATEGORY2,
                "Digital Video Games" : CATEGORY2,
                "Network Media Player" : CATEGORY2,
                "TV" : CATEGORY2,
                "Home Theater" : CATEGORY2,
                "DVD" : CATEGORY2,
                "Software" : CATEGORY2,
                "Digital Software" : CATEGORY2,
                "Mobile Application" : CATEGORY2,
                //Home & Office
                "Kitchen" : CATEGORY3,
                "Home Improvement" : CATEGORY3,
                "Home" : CATEGORY3,
                "Furniture" : CATEGORY3,
                "Office Product" : CATEGORY3,
                //Music
                "Music" : CATEGORY4,
                "Musical Instrument" : CATEGORY4,
                //Sports
                "Sports" : CATEGORY5
                
            };

            
        },
        
        getCategory : function(category){
            if(this.categories[category]) {
                return this.categories[category];
            }
            return "Miscellaneous";
        },
   
    }
   
    return Categories;
    
});

CategoriesServer = new server.model.Categories();
CategoriesServer.init();