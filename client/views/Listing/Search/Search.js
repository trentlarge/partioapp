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
