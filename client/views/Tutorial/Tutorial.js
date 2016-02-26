Template.main.events({
    'click .skipTutorial': function(e, template) {
        finishTutorial()
    } 
});

Template.lend.events({
    'click .skipTutorial': function(e, template) { 
        finishTutorial()
    } 
});

Template.listing.events({
    'click .skipTutorial': function(e, template) { 
        finishTutorial()
    } 
});

Template.transactions.events({
    'click .skipTutorial': function(e, template) { 
        finishTutorial()
    } 
});

function finishTutorial() {
    
    Router.go('/profile');
    
    //check tutorial on database
    Meteor.call('checkTutorial', function() {
        Session.set('tutorialEnabled', false); 
        $('body').removeClass('block-background');  
    }); 
}

// PART 1

tutorialSteps = {
    /*============
    === PART 1 ===
    ==============*/
    '1': [
          {
            template: Template.tutorial_p1_step1,
            onLoad: function() { 
                 setTimeout(function(){
                    $('.action-tutorial-next').text('Start Tour');
                    if(!$('.skipTutorial').is(':visible')) {
                        $('.modal-footer').append('<a class="skipTutorial">SKIP TOUR</a>');
                    }
                }, 10);
            }
          },
          {
            template: Template.tutorial_p1_step2,
            spot: ".top-part",
            onLoad: function() {
                setTimeout(function(){
                    $('.action-tutorial-finish').text('Next');
                }, 10);
            }
          }
    ],
    /*============
    === PART 2 ===
    ==============*/
    '2': [
          {
            template: Template.tutorial_p2_step1,
            onLoad: function() {
                Session.set('lendTab', 'manual');
                setTimeout(function(){
                    if(!$('.skipTutorial').is(':visible')) {
                        $('.modal-footer').append('<a class="skipTutorial">SKIP TOUR</a>');
                        $('.overflow-scroll').scrollTop(0);
                    }
                },10)
            }
          },
          {
            template: Template.tutorial_p2_step2,
            spot: ".item-divider, .priceLabel, .userPrice",
            onLoad: function() {
                Session.set('lendTab', 'manual');
                $('.overflow-scroll').scrollTop(50);
            }
          },
          {
            template: Template.tutorial_p2_step3,
            spot: ".box-barcode",
            onLoad: function() {
                Session.set('lendTab', 'barcode');
            }
          },
          {
            template: Template.tutorial_p2_step4,
            spot: ".box-camfind",
            onLoad: function() {
                Session.set('lendTab', 'camfind');
                setTimeout(function(){
                    $('.action-tutorial-finish').text('Next');
                }, 10);
            }
          }
    ],
    /*============
    === PART 3 ===
    ==============*/
    '3': [
          {
            template: Template.tutorial_p3_step1,
            onLoad: function() { 
                setTimeout(function(){
                    if(!$('.skipTutorial').is(':visible')) {
                        $('.modal-footer').append('<a class="skipTutorial">SKIP TOUR</a>');
                    }
                    $('.action-tutorial-next').click();
                }, 500);
            }
          },
          {
            template: Template.tutorial_p3_step2,
            spot: ".bottom-part",
            onLoad: function() {
                setTimeout(function(){
                    $('.action-tutorial-finish').text('Next').css({'border-radius': '5px'});
                    $('.action-tutorial-back').hide();
                }, 10);
            }
          }
    ],
    /*============
    === PART 4 ===
    ==============*/
    '4': [
          {
            template: Template.tutorial_p4_step1,
            onLoad: function() {
                setTimeout(function(){
                    if(!$('.skipTutorial').is(':visible')) {
                        $('.modal-footer').append('<a class="skipTutorial">SKIP TOUR</a>');
                    }
                    $('.modal-dialog .btn-success').text('Next');
                }, 10);
            }
          }
    ],
    /*============
    === PART 5 ===
    ==============*/
    '5': [
          {
            template: Template.tutorial_p5_step1,
            onLoad: function() { 
                setTimeout(function(){
                    if(!$('.skipTutorial').is(':visible')) {
                        $('.modal-footer').append('<a class="skipTutorial">SKIP TOUR</a>');
                    }
                }, 10);
            }
          }
    ],
};

Template.partioTutorial.helpers({
    tutorialEnabled: function() {
        if(Session.get('tutorialEnabled')) {
            $('body').addClass('block-background');
        }
        return Session.get('tutorialEnabled');    
    },
    tutorialPart: function(part) {
        return (Session.get('tutorialPart') == part) ? true : false;
    },
    options: function(part) {
        
        var option = {
            id: "tutorialPart" + part,
            steps: tutorialSteps[part],
            emitter: new EventEmitter(),
        }
        
        switch(part) {
            case 1: 
                option.onFinish = function() { 
                    Session.set('tutorialPart', 2);
                    Router.go('/lend');
                }
                break;
            case 2: 
                option.onFinish = function() { 
                    Session.set('tutorialPart', 3);
                    Router.go('/');
                }
                break;
            case 3:
                option.onFinish = function() { 
                    Session.set('tutorialPart', 4);
                    Router.go('/listing');
                }
                break;
            case 4:
                option.onFinish = function() { 
                    Session.set('tutorialPart', 5);
                    Router.go('/transactions');
                }
                break;
            case 5:
                option.onFinish = function() { 
                    //check tutorial on database
                    finishTutorial();
                }
                break;
            default:
                
        }

        return option;
    }
})
    
// PROFILE TUTORIAL

profileTutorialSteps = [
   {
       template: Template.profileTutorial_step1,
       onLoad: function() { 
           setTimeout(function(){
               $('.action-tutorial-next').click();
           }, 500);
       }
  },
  {
      template: Template.profileTutorial_step2,
      spot: ".item-mobile, .item-birthdate",
      onLoad: function() {
          setTimeout(function(){
              $('.action-tutorial-next').css({'border-radius': '5px'});
              $('.action-tutorial-back').hide();
          }, 10);
      }
  },
  {
      template: Template.profileTutorial_step3,
      spot: ".item-college",
      onLoad: function() {
          $('.overflow-scroll').scrollTop(0);
          setTimeout(function(){
              $('.action-tutorial-next').css({
                  'border-radius': '0px', 
                  'border-top-right-radius': '5px', 
                  'border-bottom-right-radius': '5px'
              });
              $('.action-tutorial-back').show();
          }, 10); 
      }
  },
  {
      template: Template.profileTutorial_step4,
      spot: ".card-profile-menu",
      onLoad: function() {
          $('.overflow-scroll').scrollTop(200);
      }
  }
];

Template.partioProfileTutorial.helpers({
    profileTutorialEnabled: function() {
        if(Session.get('profileTutorialEnabled')) {
            $('body').addClass('block-background');
        }
        return Session.get('profileTutorialEnabled');    
    },
    options: function() {
        return {
            id: "profileTutorial",
            steps: profileTutorialSteps,
            emitter: new EventEmitter(),
            onFinish: function() { 
                //check profile tutorial on database
                Meteor.call('checkProfileTutorial', function() {
                    Session.set('profileTutorialEnabled', false);
                    $('body').removeClass('block-background');
                }); 
            }
        };
    }
});
                                







// OLD TUTORIAL

Template.appTutorial.rendered = function() {
    Session.set('tutorialStarted', false);
};

Template.appTutorial.helpers({
    
    isTutorialStarted: function() {
        return Session.get('tutorialStarted');
    }
    
});

Template.appTutorial.events({
    
    'click #startTutorial': function() {
        Session.set('tutorialStarted', true);
    },
    
    'click #jumpTutorial': function() {
        $('.modal .bar button').click();
    },
    
});