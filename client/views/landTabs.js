Template.lendTabs.events({
  'click .tab-item': function (event, template) {
     var tabName = $(event.currentTarget).data('id');
     Session.set('lendTab', tabName);
  }
});

Template.lendTabs.helpers({
  isActiveClass : function(context) {
    
    //Default: CamFind
    if(!Session.get('lendTab')){
      if(context.hash.name == 'camfind') {
        return true;
      }
    } else {
      if(context.hash.name == Session.get('lendTab')) {
        return true;
      }

      //resultsCamFind
      if(Session.get('lendTab') == 'resultsCamFind' && context.hash.name == 'camfind'){
        return true;
      }
    }

    return false;
  }
});
