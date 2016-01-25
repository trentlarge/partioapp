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
    
    var users = {
        duke: this.data.getTotalUsersByUniversity("@duke.edu"),
        yale: this.data.getTotalUsersByUniversity("@yale.edu"),
        total: this.data.getUsersLenght()
    }
    
    users.others = users.total - users.duke - users.yale;
    
    var usersData = [
    {
        value: users.duke,
        color:"#F7464A",
        highlight: "#FF5A5E",
        label: "Duke"
    },
    {
        value: users.yale,
        color: "#46BFBD",
        highlight: "#5AD3D1",
        label: "Yale"
    },
    {
        value: users.others,
        color: "#FDB45C",
        highlight: "#FFC870",
        label: "Others"
    }
    ];
    
    var ctx = document.getElementById("universityUsersChart").getContext("2d");
    var myNewChart = new Chart(ctx).Pie(usersData, options);
    
    // NUMBER OF PRODUCTS BY USER UNIVERSITY
    
    var products = {
        duke: this.data.getTotalProductsByUniversity("@duke.edu"),
        yale: this.data.getTotalProductsByUniversity("@yale.edu"),
        total: this.data.getProductsLenght()
    }
    
    products.others = products.total - products.duke - products.yale;
    
    var productsData = [
    {
        value: products.duke,
        color:"#F7464A",
        highlight: "#FF5A5E",
        label: "Duke"
    },
    {
        value: products.yale,
        color: "#46BFBD",
        highlight: "#5AD3D1",
        label: "Yale"
    },
    {
        value: products.others,
        color: "#FDB45C",
        highlight: "#FFC870",
        label: "Others"
    }
    ];
    
    var ctx = document.getElementById("universityProductsChart").getContext("2d");
    var myNewChart = new Chart(ctx).Pie(productsData, options);
    
};