myfeedExport = function () {
    var xmlBuilder = Meteor.npmRequire('xmlbuilder'); //needed to use xmlbuilder
    var feed = xmlBuilder.create('feed'); //sets up the "parent" xml object
    Widgets.find({status: "Active"}).forEach(function(widgetData) {
        var feedwidget = feed.ele('widget');
        feedwidget.ele('name', widgetData.name);
        feedwidget.ele('data').dat(widgetData.data); //create <data><![CDATA[yourdata]]></data>"
    });
    return feed.end({pretty: true})
}
