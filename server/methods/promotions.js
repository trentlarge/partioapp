Meteor.methods({  
  addEarningPromotionValue: function(userId, object){

    if(!object.value || !object.userId || !object.from){
      throw new Meteor.Error("addValue", 'missing fields');
    }

    var _user = Meteor.users.findOne({ '_id': userId });
    
    if(!_user.private.promotions) {
       throw new Meteor.Error("addValue", 'user '+object.userId+' doesn\`t has promotion field');
    }
    
    object.timestamp = Date.now();
    
    var _earning = {  total:0,
                      timeline: []
                   };

    if(_user.private.promotions.earning && _user.private.promotions.earning.timeline.length > 0){
      _earning.timeline = _user.private.promotions.earning.timeline;
    }

    _earning.timeline.push(object);

    _earning.timeline.forEach(function(item) {
      _earning.total += (Number(item.value) || 0);
    });

    _earning.total = _earning.total.toFixed(2);

    Meteor.users.update({"_id": _user._id }, 
      { $set: {
        "private.promotions.earning": _earning
      }});
  },

  addSpendingPromotionValue: function(userId, object){
    if(!object.value || !object.from){
      throw new Meteor.Error("addValue", 'missing fields');
    }

    var _user = Meteor.users.findOne({ '_id': userId });
    
    if(!_user.private.promotions) {
       throw new Meteor.Error("addValue", 'user '+object.userId+' doesn\`t has promotion field');
    }
    
    object.timestamp = Date.now();
    
    var _spending = { total:0,
                      timeline: []
                    };

    if(_user.private.promotions.spending && _user.private.promotions.spending.timeline.length > 0){
      _spending.timeline = _user.private.promotions.spending.timeline;
    }

    _spending.timeline.push(object);

    _spending.timeline.forEach(function(item) {
      _spending.total += (Number(item.value) || 0);
    });

    _spending.total = _spending.total.toFixed(2);

    Meteor.users.update({"_id": _user._id }, 
      { $set: {
        "private.promotions.spending": _spending
      }});
  },
});