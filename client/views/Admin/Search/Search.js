Template.adminSearch.rendered = function() { 
    Session.set("adminSearchPageNumber", 1);
    Session.set("adminSearchPageSize", 15);
    Session.set('adminSearchText', '');
}

Template.adminSearch.destroyed = function() {  
    Session.set("adminSearchPageNumber", null);
    Session.set("adminSearchPageSize", null);
    Session.set('adminSearchText', null); 
}

Template.adminSearch.events({
    
    'scroll .overflow-scroll': function(e, t) {
        var parent = t.$(e.currentTarget);

        var pageNumber = Session.get('adminSearchPageNumber');
        var pageSize = Session.get('adminSearchPageSize');
        
        if($('.card').length < pageNumber * pageSize) {
            return;
        }

        //if(parent.scrollTop() + parent.height() >= scrollingElement.innerHeight() + 20) {
        if(parent.scrollTop() + parent.height() >= parent[0].scrollHeight) {        
            $('.loadbox').fadeIn('fast',function(){
                Session.set("adminSearchPageNumber", pageNumber + 1);
            });
        }
    },
    
});


// SEARCH BOX

Template.adminSearchBox.helpers({
    
    adminSearchText: function() {
        return Session.get('adminSearchText');    
    },
    
});

Template.adminSearchBox.events({
    
    'keypress .search-input': function(e, template) {
        var text = $(e.target).val();

        if (e.charCode == 13 || e.keyCode == 13) {

          //reset sessions
          Session.set("adminSearchPageNumber", 1);

          //set text
          Session.set('adminSearchText', text);
            
        }
    },
    
});