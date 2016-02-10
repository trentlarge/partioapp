Template.tutorial.rendered = function() {
    
    Session.set('tutorialStarted', false);
    
};

Template.tutorial.helpers({
    
    isTutorialStarted: function() {
        return Session.get('tutorialStarted');
    }
    
});

Template.tutorial.events({
    
    'click #startTutorial': function() {
        Session.set('tutorialStarted', true);
    },
    
    'click #jumpTutorial': function() {
        $('.modal .bar button').click();
    },
    
});