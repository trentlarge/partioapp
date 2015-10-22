Template.lendTabs.events({
  'click .tab-item': function (event, template) {
     var tabName = $(event.currentTarget).data('id');
     Session.set('lendTab', tabName);

     $('.tab-item').removeClass('active');
     $('.tab-item[data-id='+tabName+']').addClass('active');
  }
});
