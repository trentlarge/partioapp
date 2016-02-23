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

        if($('.title')) {
            $('.title').hide();
        }
        
        inputBox.focus();
    } else {
        inputBox.css({
          'width':'0%',
          'padding': '0'
        });

        inputIcon.css({
          'color': '#eeeeee'
        });

        if($('.title')) {
            $('.title').show();
        }
        
        inputBox.focusout();
        inputBox.val('');
        Session.set('isTapping', false);
    }
  },
  
  'keyup .search-header-input': function(e, template) {
      var text = $(e.target).val();
      
      //reset sessions
      Session.set("pageNumber", 1);
      
      if(!$('.loadbox').is(':visible')) {
          $('.loadbox').fadeIn('fast');    
      }
      
      //set text
      Session.set('searchText', text);
   },
    
  'keypress .search-header-input': function(e, template) {
    var text = $(e.target).val();

    if (e.charCode == 13 || e.keyCode == 13) {

      //reset sessions
      Session.set("pageNumber", 1);

      if(!Session.get('listing')) {
          Router.go('/listing');
      }

      //set text
      Session.set('searchText', text);
    }
  },
});

Template.searchHeader.helpers({
    searchText: function() {
        return Session.get('searchText');
    },
})
