Template.lend.helpers({
    dynamicTemplate: function(){
        return (Session.get('lendTab')) ? Session.get('lendTab') : 'camfind' ;
    }
});

Template.lend.rendered = function() {
    //Session.set('scanResult', null);
    //Session.set('allResults', null);

    if(Session.get('cardManualEntry')) {
        Session.set('lendTab', 'manual');
        Session.set('cardManualEntry', null)
    } else {
        Session.set('lendTab', 'manual');
    }
}
