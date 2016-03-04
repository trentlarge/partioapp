Template.analytics.rendered = function() {
    
    if(!this.data.isUserPermited()) {
        return;
    }
    
    var self = this.data;
    
    //set pages 
    
    var pages = {
        duke: 0,
        yale: 0,
        others: 0,
        total: 0,
        connections: 0
    }
    
    Session.set('pages', pages);
    
    var maxPages = {
        duke: Math.floor(this.data.getTotalUsersByUniversity(1)/10),
        yale: Math.floor(this.data.getTotalUsersByUniversity(2)/10),
        others: Math.floor(this.data.getTotalUsersByUniversity(0)/10),
        total: Math.floor(this.data.getLenght('users')/10),
        connections: Math.floor(this.data.getTotalConnections(0)/10),
    }
    
    Session.set('maxPages', maxPages);
    
    var options = {
        //Boolean - Whether we should show a stroke on each segment
        segmentShowStroke : true,

        //String - The colour of each segment stroke
        segmentStrokeColor : "#fff",

        //Number - The width of each segment stroke
        segmentStrokeWidth : 2,

        //Number - The percentage of the chart that we cut out of the middle
        percentageInnerCutout : 50, // This is 0 for Pie charts

        //Number - Amount of animation steps
        animationSteps : 100,

        //String - Animation easing effect
        animationEasing : "easeOutBounce",

        //Boolean - Whether we animate the rotation of the Doughnut
        animateRotate : true,

        //Boolean - Whether we animate scaling the Doughnut from the centre
        animateScale : false,

        responsive: false
    };
    
    var responsiveOptions = {
        
        responsive: true
        
    };
    
    
    /* ==== GENERIC ANALYTICS ==== */
    
    // NUMBER OF ELEMENTS BY UNIVERSITY
    
    var data = {
        duke: (function() {
            return (self.analyticsId === 'users') ? 
                self.getTotalUsersByUniversity(1) : 
                self.getTotalByUniversity(1);
        })(),
        yale: (function() {
            return (self.analyticsId === 'users') ? 
                self.getTotalUsersByUniversity(2) : 
                self.getTotalByUniversity(2);
        })(),
        others: (function() {
            return (self.analyticsId === 'users') ? 
                self.getTotalUsersByUniversity(0) : 
                self.getTotalByUniversity(0);
        })()
    }
    
    data.incomplete = this.data.getLenght() - (data.duke + data.yale + data.others);
    
    var chartData = [
    {
        value: data.duke,
        color:"#F7464A",
        highlight: "#FF5A5E",
        label: "Duke"
    },
    {
        value: data.yale,
        color: "#46BFBD",
        highlight: "#5AD3D1",
        label: "Yale"
    },
    {
        value: data.others,
        color: "#FDB45C",
        highlight: "#FFC870",
        label: "Others"
    },
    {
        value: data.incomplete,
        color: "#272727",
        highlight: "#494949",
        label: "Null"
    }
    ];
    
    var ctx = document.getElementById(this.data.analyticsId + "Chart").getContext("2d");
    var myNewChart = new Chart(ctx).Pie(chartData, options);
    
    /* ==== USERS ANALYTICS ==== */
    
    if(self.analyticsId === 'users') {
                
        // NUMBER OF USERS BY MONTH
        
        var data = {
            labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            datasets: [
                {
                    label: "Users",
                    fillColor: "rgba(151,187,205,0.2)",
                    strokeColor: "rgba(151,187,205,1)",
                    pointColor: "rgba(151,187,205,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(151,187,205,1)",
                    data: this.data.getUsersByMonth(),
                },
//                {
//                    label: "Users",
//                    fillColor: "rgba(220,220,220,0.2)",
//                    strokeColor: "rgba(220,220,220,1)",
//                    pointColor: "rgba(220,220,220,1)",
//                    pointStrokeColor: "#fff",
//                    pointHighlightFill: "#fff",
//                    pointHighlightStroke: "rgba(220,220,220,1)",
//                    data: this.data.getUsersByMonth()
//                },
            ]
        };
        
        var ctx = document.getElementById(this.data.analyticsId + "DateChart").getContext("2d");
        var myLineChart = new Chart(ctx).Line(data, responsiveOptions);
        
        // NUMBER OF USER BY DAY
        
         var data = {
            labels: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            datasets: [
                {
                    label: "Users",
                    fillColor: "rgba(151,187,205,0.2)",
                    strokeColor: "rgba(151,187,205,1)",
                    pointColor: "rgba(151,187,205,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(151,187,205,1)",
                    data: this.data.getUsersByDays(),
                },
            ]
        };
        
        var ctx = document.getElementById(this.data.analyticsId + "DateDaysChart").getContext("2d");
        var myLineChart = new Chart(ctx).Line(data, responsiveOptions);
        
    }
    
    /* ==== PRODUCTS ANALYTICS ==== */
    
    if(self.analyticsId === 'products') {
        
        // PRODUCTS BY CATEGORIES
        
        var data = {
            labels: Categories.getAllCategoriesText(),
            datasets: [
                {
                    label: "Products by Categories",
                    fillColor: "rgba(151,187,205,0.2)",
                    strokeColor: "rgba(151,187,205,1)",
                    pointColor: "rgba(151,187,205,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(151,187,205,1)",
                    data: this.data.getProductsByCategories(),
                },
            ]
        };
        
        var ctx = document.getElementById(this.data.analyticsId + "CategoriesChart").getContext("2d");
        var myBarChart = new Chart(ctx).Bar(data, responsiveOptions);
        
    }
    
    /* ==== CONNECTIONS ANALYTICS ==== */
    
    if(self.analyticsId === 'connections') {
        
        // CONNECTIONS BY BORROW STATE (IN PROGRESS)
        
        var data = {
            labels: ["WAITING", "PAYMENT", "IN USE", "DONE", "RETURNED"],
            datasets: [
                {
                    label: "Connections by Status",
                    fillColor: "rgba(151,187,205,0.2)",
                    strokeColor: "rgba(151,187,205,1)",
                    pointColor: "rgba(151,187,205,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(151,187,205,1)",
                    data: this.data.getBorrowConnectionsByState(),
                },
            ]
        };
        
        var ctx = document.getElementById(this.data.analyticsId + "StateChart").getContext("2d");
        var myBarChart = new Chart(ctx).Bar(data, responsiveOptions);
        
        // CONNECTIONS BY BORROW STATE (FINISHED)
        
        var data = {
            labels: ["WAITING", "PAYMENT", "IN USE", "DONE", "RETURNED"],
            datasets: [
                {
                    label: "Connections by Status",
                    fillColor: "rgba(151,187,205,0.2)",
                    strokeColor: "rgba(151,187,205,1)",
                    pointColor: "rgba(151,187,205,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(151,187,205,1)",
                    data: this.data.getBorrowConnectionsByStateFinished(),
                },
            ]
        };
        
        var ctx = document.getElementById(this.data.analyticsId + "StateFinishedChart").getContext("2d");
        var myBarChart = new Chart(ctx).Bar(data, responsiveOptions);
        
        // CONNECTIONS BY PURCHASING STATE (IN PROGRESS)
        
        var data = {
            labels: states = ["WAITING", "PAYMENT", "SOLD", "CONFIRMED"],
            datasets: [
                {
                    label: "Connections by Status",
                    fillColor: "rgba(151,187,205,0.2)",
                    strokeColor: "rgba(151,187,205,1)",
                    pointColor: "rgba(151,187,205,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(151,187,205,1)",
                    data: this.data.getPurchasingConnectionsByState(),
                },
            ]
        };
        
        var ctx = document.getElementById(this.data.analyticsId + "PurchasingChart").getContext("2d");
        var myBarChart = new Chart(ctx).Bar(data, responsiveOptions);
        
        // CONNECTIONS BY PURCHASING STATE (FINISHED)
        
        var data = {
            labels: states = ["WAITING", "PAYMENT", "SOLD", "CONFIRMED"],
            datasets: [
                {
                    label: "Connections by Status",
                    fillColor: "rgba(151,187,205,0.2)",
                    strokeColor: "rgba(151,187,205,1)",
                    pointColor: "rgba(151,187,205,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(151,187,205,1)",
                    data: this.data.getPurchasingConnectionsByStateFinished(),
                },
            ]
        };
        
        var ctx = document.getElementById(this.data.analyticsId + "PurchasingFinishedChart").getContext("2d");
        var myBarChart = new Chart(ctx).Bar(data, responsiveOptions);
        
        // CONNECTIONS FINISHED/IN PROGRESS
        
        var chartData = [
            {
                value: this.data.getConnectionsFinished(),
                color:"#F7464A",
                highlight: "#FF5A5E",
                label: "Finished"
            },
            {
                value: this.data.getConnectionsInProgress(),
                color: "#46BFBD",
                highlight: "#5AD3D1",
                label: "In Progress"
            }
        ];
    
        var ctx = document.getElementById(this.data.analyticsId + "ProgressChart").getContext("2d");
        var myNewChart = new Chart(ctx).Pie(chartData, options);
        
        // CONNECTIONS REQUESTED BY MONTH
        
         var data = {
            labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            datasets: [
                {
                    label: "Requests",
                    fillColor: "rgba(151,187,205,0.2)",
                    strokeColor: "rgba(151,187,205,1)",
                    pointColor: "rgba(151,187,205,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(151,187,205,1)",
                    data: this.data.getConnectionsRequestedByMonth(),
                },
            ]
        };
        
        var ctx = document.getElementById(this.data.analyticsId + "RequestedChart").getContext("2d");
        var myLineChart = new Chart(ctx).Line(data, responsiveOptions);
        
    }
    
    /* ==== TRANSACTIONS ANALYTICS ==== */
    
    if(self.analyticsId === 'transactions') {
        
    }
    
};

Template.analytics.events({
    
   // Duke Pagination
    
   'click #nextDukeUsers': function() {
       var pages = Session.get('pages');
       var maxPages = Session.get('maxPages');
       if(pages.duke < maxPages.duke) {
           pages.duke++;
       }
       Session.set('pages', pages);
   },
    
   'click #previousDukeUsers': function() {
       var pages = Session.get('pages');
       if(pages.duke > 0) {
           pages.duke--;
       }
       Session.set('pages', pages);
   },
    
   // Yale Pagination
    
   'click #nextYaleUsers': function() {
       var pages = Session.get('pages');
       var maxPages = Session.get('maxPages');
       if(pages.yale < maxPages.yale) {
           pages.yale++;
       }
       Session.set('pages', pages);
   },
    
   'click #previousYaleUsers': function() {
       var pages = Session.get('pages');
       if(pages.yale > 0) {
           pages.yale--;
       }
       Session.set('pages', pages);
   },
    
   // Others Pagination
    
   'click #nextOthersUsers': function() {
       var pages = Session.get('pages');
       var maxPages = Session.get('maxPages');
       if(pages.others < maxPages.yale) {
           pages.others++;
       }
       Session.set('pages', pages);
   },
    
   'click #previousOthersUsers': function() {
       var pages = Session.get('pages');
       if(pages.others > 0) {
           pages.others--;
       }
       Session.set('pages', pages);
   },
    
   // All Users Pagination
    
   'click #nextAllUsers': function() {
       var pages = Session.get('pages');
       var maxPages = Session.get('maxPages');
       if(pages.total < maxPages.total) {
           pages.total++;
       }
       Session.set('pages', pages);
   },
    
   'click #previousAllUsers': function() {
       var pages = Session.get('pages');
       if(pages.total > 0) {
           pages.total--;
       }
       Session.set('pages', pages);
   },
    
   // Connection Pagination
    
   'click #nextConnection': function() {
       var pages = Session.get('pages');
       var maxPages = Session.get('maxPages');
       if(pages.connections < maxPages.connections) {
           pages.connections++;
       }
       Session.set('pages', pages);
   },
    
   'click #previousConnection': function() {
       var pages = Session.get('pages');
       if(pages.connections > 0) {
           pages.connections--;
       }
       Session.set('pages', pages);
   },
    
});