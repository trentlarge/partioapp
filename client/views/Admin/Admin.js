Template.admin.rendered = function() {
    
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
        
        //String - A legend template
        legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"

    };
    
    // NUMBER OF USER BY UNIVERSITY
    
    var usersData = [
    {
        value: this.data.getTotalUsersByUniversity("@duke.edu"),
        color:"#F7464A",
        highlight: "#FF5A5E",
        label: "Duke"
    },
    {
        value: this.data.getTotalUsersByUniversity("@yale.edu"),
        color: "#46BFBD",
        highlight: "#5AD3D1",
        label: "Yale"
    },
    {
        value: this.data.getTotalUsersByUniversity("@gmail.com"),
        color: "#FDB45C",
        highlight: "#FFC870",
        label: "Others"
    }
    ];
    
    var ctx = document.getElementById("universityUsersChart").getContext("2d");
    var myNewChart = new Chart(ctx).Pie(usersData, options);
    
    // NUMBER OF PRODUCTS BY USER UNIVERSITY
    
    var productsData = [
    {
        value: this.data.getTotalProductsByUniversity("@duke.edu"),
        color:"#F7464A",
        highlight: "#FF5A5E",
        label: "Duke"
    },
    {
        value: this.data.getTotalProductsByUniversity("@yale.edu"),
        color: "#46BFBD",
        highlight: "#5AD3D1",
        label: "Yale"
    },
    {
        value: this.data.getTotalProductsByUniversity("@gmail.com"),
        color: "#FDB45C",
        highlight: "#FFC870",
        label: "Others"
    }
    ];
    
    var ctx = document.getElementById("universityProductsChart").getContext("2d");
    var myNewChart = new Chart(ctx).Pie(productsData, options);
    
};