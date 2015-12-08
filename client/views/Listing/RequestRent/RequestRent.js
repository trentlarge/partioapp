Template.requestRent.rendered = function() {

//	var dataContext = this.data;
//	//Chat input textarea auto-resize when more than 1 line is entered
//	Session.set("_requestor", dataContext.requestor);
//	Session.set("_owner", dataContext.productData.ownerId);

  var nowTemp = new Date();
  var now = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);

  $('.range').datepicker({
    format: 'mm-dd-yyyy',
    startDate: 'd',
    todayHighlight: true,
    toggleActive: true,
    inputs: $('.range-start, .range-end'),
  });

  $('.datepicker-days .active').click(function(){
    $(this).removeClass('selected').removeClass('active');
  });

  var rentPrice = {
    "semesters": 0,
    "months": 0,
    "weeks": 0,
    "days": 0,
  }

  Session.set('rentPrice', rentPrice);

  Session.set('amountPrice', 0);
  Session.set('numberDays', 0);
  Session.set('numberWeeks', 0);
  Session.set('numberMonths', 0);
  Session.set('numberSemesters', 0);

  Session.set('totalDays', 0);
}

Template.requestRent.helpers({
  getCategoryIcon: function() {
    return Categories.getCategoryIconByText(this.category);
  },
	noProfileYet: function() {
		if (this.avatar === "notSet") {
			return true;
		} else {
			return false;
		}
	},
	userInfo: function() {
		return Meteor.users.findOne(this.ownerId).profile;
	},
	approvedStatus: function() {
		return Connections.findOne(this._id).state !== 'WAITING' ? true : false;
	},
  enableRequest: function() {
      return (Session.get('amountPrice') > 0) ? '' : 'disabled';
  },
	calculatedPrice: function() {
    if(!Session.get('rentPrice')) {
      return 0;
    }

    var rentPrice = Session.get('rentPrice');
    var price =
            (Number(this.rentPrice.semester) * rentPrice.semesters) +
            (Number(this.rentPrice.month) * rentPrice.months) +
            (Number(this.rentPrice.week) * rentPrice.weeks) +
            (Number(this.rentPrice.day) * rentPrice.days);

    Session.set('amountPrice', price.toFixed(2));
		return price.toFixed(2);
	},
  validatePrice: function() {

    if(!Session.get('rentPrice')) {
      return 'disabled';
    }

    var rentPrice = Session.get('rentPrice');
    var price =
          (Number(this.rentPrice.semester) * rentPrice.semesters) +
          (Number(this.rentPrice.month) * rentPrice.months) +
          (Number(this.rentPrice.week) * rentPrice.weeks) +
          (Number(this.rentPrice.day) * rentPrice.days);

    if(price > 0) {
      return '';
    }
    else {
      return 'disabled';
    }
  },
  numberDays: function() {
    return Session.get('numberDays');
  },
  numberWeeks: function() {
    return Session.get('numberWeeks');
  },
  numberMonths: function() {
    return Session.get('numberMonths');
  },
  numberSemesters: function() {
    return Session.get('numberSemesters');
  },
  totalPriceDays: function() {
    return (Session.get('numberDays') * this.rentPrice.day).toFixed(2);
  },
  totalPriceWeeks: function() {
    return (Session.get('numberWeeks') * this.rentPrice.week).toFixed(2);
  },
  totalPriceMonths: function() {
    return (Session.get('numberMonths') * this.rentPrice.month).toFixed(2);
  },
  totalPriceSemesters: function() {
    return (Session.get('numberSemesters') * this.rentPrice.semester).toFixed(2);
  },
  activeDays: function() {
    return (Session.get('numberDays') > 0) ? 'active' : '';
  },
  activeWeeks: function() {
    return (Session.get('numberWeeks') > 0) ? 'active' : '';
  },
  activeMonths: function() {
    return (Session.get('numberMonths') > 0) ? 'active' : '';
  },
  activeSemesters: function() {
    return (Session.get('numberSemesters') > 0) ? 'active' : '';
  },
  isBorrowed: function() {
    return (this.state === 'IN USE') ? true : false;
  },
  isReturned: function() {
    return (this.state === 'RETURNED') ? true : false;
  }
});

Template.requestRent.events({
  'click #sendRequest': function() {

    if(!Meteor.user().profile.defaultPay){
      IonPopup.show({
        title: 'Update profile',
        template: '<div class="center">Please, update your cards to borrow this item.</div>',
        buttons: [{
          text: 'OK',
          type: 'button-energized',
          onTap: function() {
            IonPopup.close();
            $('#closeRequest').click();
            Router.go('/profile/savedcards/');
          }
        }]
      });
      return false;
    }

    console.log('requesting product...');

    var ownerId = this.ownerId;
    var productId = this._id;
    var borrowDetails = {
      date : {
        start : $(".range-start").datepicker("getDate"),
        end : $(".range-end").datepicker("getDate"),
        totalDays : Session.get('totalDays'),
        days : Session.get('numberDays'),
        weeks : Session.get('numberWeeks'),
        months : Session.get('numberMonths'),
        semesters : Session.get('numberSemesters')
      },
      price : {
        total : Session.get('amountPrice'),
        totalDay : Session.get('numberDays') * this.rentPrice.day,
        totalWeek : Session.get('numberWeeks') * this.rentPrice.week,
        totalMonth : Session.get('numberMonths') * this.rentPrice.month,
        totalSemester : Session.get('numberSemesters') * this.rentPrice.semester
      }
    };

    IonPopup.confirm({
      okText: 'Proceed',
      cancelText: 'Cancel',
      title: 'Continuing will send a request to the product Owner',
      template: '<div class="center">You\'ll receive a notification once the owner accepts your request</div>',
      onOk: function() {
        console.log("proceeding with connection");
        PartioLoad.show();
        Meteor.call('requestOwner', Meteor.userId(), productId, ownerId, borrowDetails, function(error, result) {
          if (!error) {
            PartioLoad.hide();
            IonPopup.close();
            setTimeout(function(){
              IonPopup.show({
                title: 'Request Sent',
                template: '<div class="center">Now you just need to wait for owner\'s approval</div>',
                buttons: [{
                  text: 'OK',
                  type: 'button-energized',
                  onTap: function() {
                    IonPopup.close();
                    $('#closeRequest').click();
                    Router.go('/renting');
                  }
                }]
              });
            }, 500);
          } else {
            PartioLoad.hide();
            console.log(error);
          }
        })
      },
      onCancel: function() {
        console.log('Cancelled');
        return false;
      }
    });
  },

  'click .rent-price': function(e, template) {
    var rentPrice = $('.rent-price');
    var rentPriceItem = $('.rent-price-item');

    if(!rentPriceItem.is(':visible')){
      rentPriceItem.slideDown('fast');
      rentPrice.find('.chevron-icon').removeClass('ion-chevron-up').addClass('ion-chevron-down');
    }
    else {
      rentPriceItem.slideUp('fast');
      rentPrice.find('.chevron-icon').removeClass('ion-chevron-down').addClass('ion-chevron-up');
    }
  },

  'changeDate .range-end': function(e, template) {
    var start = $(".range-start").datepicker("getDate");
    var end   = $(".range-end").datepicker("getDate");

    var diff = new Date(end - start);
    var totalDays = (diff/1000/60/60/24) + 1;

    if($('.selected').length === 0) {
      totalDays = 0;
    }

    Session.set('totalDays', totalDays);

    //rent days and period
    var rentDays = $('.rent-days'),
      rentPeriod = $('.rent-period');

    rentDays.empty();
    rentPeriod.empty();

    if(totalDays > 0) {
      if(totalDays === 1) {
        rentDays.append(Math.floor(totalDays) + ' day');
      } else {
        rentDays.append(Math.floor(totalDays) + ' days');
      }

      var startDate = $('.range-start').data('datepicker').getFormattedDate('mm/dd/yy'),
          endDate = $('.range-end').data('datepicker').getFormattedDate('mm/dd/yy');

      rentPeriod.append('('+startDate + ' to ' + endDate+')');
    }

    //rent prices

    //semesters
    var semesters = Math.floor(totalDays/120);
    totalDays =  Math.floor(totalDays % 120);
    //months
    var months = Math.floor(totalDays/30);
    totalDays =  Math.floor(totalDays % 30);
    //weeks
    var weeks = Math.floor(totalDays/7);
    totalDays =  Math.floor(totalDays % 7);
    //days
    var days = totalDays;

    var rentPrice = {
      "semesters": semesters,
      "months": months,
      "weeks": weeks,
      "days": days,
    };

    Session.set('rentPrice', rentPrice);

    Session.set('numberDays', days);
    Session.set('numberWeeks', weeks);
    Session.set('numberMonths', months);
    Session.set('numberSemesters', semesters);

    if(days > 0){ $('.thDay').addClass('active') } else { $('.thDay').removeClass('active') }
    if(weeks > 0){ $('.thWeek').addClass('active') } else { $('.thWeek').removeClass('active') }
    if(months > 0){ $('.thMonth').addClass('active') } else { $('.thMonth').removeClass('active') }
    if(semesters > 0){ $('.thSemester').addClass('active') } else { $('.thSemester').removeClass('active') }
  },
});
// function formatDate(dateObject) {
//     var d = new Date(dateObject);
//     var day = d.getDate();
//     var month = d.getMonth() + 1;
//     var year = d.getFullYear();
//     if (day < 10) {
//         day = "0" + day;
//     }
//     if (month < 10) {
//         month = "0" + month;
//     }
//     var date = month + "-" + day + "-" + year;
//
//     return date;
// }
