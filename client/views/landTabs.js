Template.lendTabs.events({
  'click .tab-item': function (event, template) {
     var tabName = $(event.currentTarget).data('id');
     Session.set('lendTab', tabName);

    //  switch (tabName) {
    //    case 'camfind':
     //
    //      break;
    //    case 'scancode':
     //
    //      break;
    //    case 'manual':
     //
    //     break;
    //  }

     $('.tab-item').removeClass('active');
     $('.tab-item[data-id='+tabName+']').addClass('active');
  }
});
