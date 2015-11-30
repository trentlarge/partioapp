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
        
        var words = $(e.target).val().trim().split(' ');
        $.each(words, function(index, word) {
            
            PackageSearch.search(word);    
            
            if(word.length >= 1) {
                Session.set('isTapping', true);
            } 
            else {
                if(words.length === 1) {
                    Session.set('isTapping', false);
                } 
            }
            
        });           
    }
    
});

Template.searchHeader.helpers({
    searchText: function() {
        return Session.get('searchText');
    },
})  
            