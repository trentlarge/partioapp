Template.search.events({
  'click #requestProduct': function() {
    console.log('requesting product...');
    var ownerId = this.ownerId;
    var productId = this._id;
    console.log(this);
    console.log(Products.findOne(this._id));
    IonModal.open("requestRent", Products.findOne(this._id));
  },
  'click #moreInfo': function() {
    console.log('display product info...');
    var productId = this._id;
    // var ownerId = this.ownerId;
    // var productId = this._id;
    // console.log(this);
    console.log(Products.findOne(this._id));
    IonModal.open("productDetail", Products.findOne(this._id));
  }
})
