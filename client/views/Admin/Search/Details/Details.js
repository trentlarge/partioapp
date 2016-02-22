Template.adminSearchDetails.destroyed = function() {
    Session.set('selectedCategory', null);
    Session.set('selectedCondition', null);
}

Template.adminSearchDetails.helpers({
    
    selectedCategory: function(category) {
        return (Session.get('selectedCategory') == category) ? 'selected' : '';
    },
    
     selectedCondition: function(index) {
        return (Session.get('selectedCondition') == index) ? 'selected' : '';
    },
    
})