Template.searchHeader.events({
    
    'click .search-header-icon': function(e, template){
        
        var inputBox = $('.search-header-input');
        
        if(inputBox.css('width') === '0px'){
            inputBox.css({
                'width':'60%',
                'padding': '15px'
            });
            inputBox.focus();
        } else {
            inputBox.css({
                'width':'0%',
                'padding': '0'
            });
            inputBox.focusout();
            inputBox.val('');
            Session.set('isTapping', false);
        }
        
    },
    
    'keyup .search-header-input': function(e, template) {
        
        var text = $(e.target).val().trim();
        console.log('Search Query: ' + text);
        if(text.length > 1) {
            Session.set('isTapping', true);
            PackageSearch.search(text);
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
            