Template.searchHeader.events({
    
    'click .search-header-icon': function(e, template){
        
        var inputBox = $('.search-header-input');
        var inputIcon = $('.search-header-icon');
        
        if(inputBox.css('width') === '0px' || inputBox.css('width') === '0%'){
            inputBox.css({
                'width':'100%',
                'padding-left': '40px'
            });
            
            inputIcon.css({
                'color': '#272727'
            });
            
            inputBox.focus();
        } else {
            inputBox.css({
                'width':'0%',
                'padding': '0'
            });
            
            inputIcon.css({
                'color': '#eeeeee'
            });
            
            inputBox.focusout();
            inputBox.val('');
            Session.set('isTapping', false);
        }
        
    },
    
    'keyup .search-header-input': function(e, template) {
        
        var text = $(e.target).val().trim();
        PackageSearch.search(text);
        //console.log('Search Query: ' + text);
        if(text.length > 1) {
            Session.set('isTapping', true);
        } 
        else {
            Session.set('isTapping', false);
        }
                      
    }
    
});

Template.searchHeader.helpers({
    searchText: function() {
        return Session.get('searchText');
    },
})  
            