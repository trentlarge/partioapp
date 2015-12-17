Template.search.rendered = function() {
 
    $('.range').datepicker({
        format: 'mm-dd-yyyy',
        startDate: 'd',
        todayHighlight: true,
        toggleActive: true,
        inputs: $('.range-start, .range-end'),
    });
    
}

Template.search.events({
    'click #requestProduct': function() {
        var ownerId = this.ownerId;
        var productId = this._id;
        IonModal.open("requestRent", Products.findOne(this._id));
    },

    'click #moreInfo': function() {
        IonModal.open("productDetail", Products.findOne(this._id));
    }
})
