//Template.admin.rendered = function() {
//    
//    if(!this.data.isUserPermited()) {
//        return;
//    }
//    
//    var options = {
//        //Boolean - Whether we should show a stroke on each segment
//        segmentShowStroke : true,
//
//        //String - The colour of each segment stroke
//        segmentStrokeColor : "#fff",
//
//        //Number - The width of each segment stroke
//        segmentStrokeWidth : 2,
//
//        //Number - The percentage of the chart that we cut out of the middle
//        percentageInnerCutout : 50, // This is 0 for Pie charts
//
//        //Number - Amount of animation steps
//        animationSteps : 100,
//
//        //String - Animation easing effect
//        animationEasing : "easeOutBounce",
//
//        //Boolean - Whether we animate the rotation of the Doughnut
//        animateRotate : true,
//
//        //Boolean - Whether we animate scaling the Doughnut from the centre
//        animateScale : false,
//        
//        //String - A legend template
//        responsive: false
//
//    };
//    
//    // NUMBER OF USER BY UNIVERSITY
//    
//    var users = {
//        duke: this.data.getTotalUsersByUniversity(1), // Duke
//        yale: this.data.getTotalUsersByUniversity(2), // Yale
//        total: this.data.getUsersLenght() // Others
//    }
//    
//    users.others = users.total - users.duke - users.yale;
//    
//    var usersData = [
//    {
//        value: users.duke,
//        color:"#F7464A",
//        highlight: "#FF5A5E",
//        label: "Duke"
//    },
//    {
//        value: users.yale,
//        color: "#46BFBD",
//        highlight: "#5AD3D1",
//        label: "Yale"
//    },
//    {
//        value: users.others,
//        color: "#FDB45C",
//        highlight: "#FFC870",
//        label: "Others"
//    }
//    ];
//    
//    var ctx = document.getElementById("adminUsers").getContext("2d");
//    var myNewChart = new Chart(ctx).Pie(usersData, options);
//    
//    // NUMBER OF PRODUCTS BY USER UNIVERSITY
//    
//    var products = {
//        duke: this.data.getTotalProductsByUniversity(1),
//        yale: this.data.getTotalProductsByUniversity(2),
//        total: this.data.getProductsLenght()
//    }
//    
//    products.others = products.total - products.duke - products.yale;
//    
//    var productsData = [
//    {
//        value: products.duke,
//        color:"#F7464A",
//        highlight: "#FF5A5E",
//        label: "Duke"
//    },
//    {
//        value: products.yale,
//        color: "#46BFBD",
//        highlight: "#5AD3D1",
//        label: "Yale"
//    },
//    {
//        value: products.others,
//        color: "#FDB45C",
//        highlight: "#FFC870",
//        label: "Others"
//    }
//    ];
//    
//    var ctx = document.getElementById("adminProducts").getContext("2d");
//    var myNewChart = new Chart(ctx).Pie(productsData, options);
//    
//    // NUMBER OF CONNECTIONS BY USER UNIVERSITY
//    
//    var connections = {
//        duke: this.data.getTotalConnectionsByUniversity(1),
//        yale: this.data.getTotalConnectionsByUniversity(2),
//        total: this.data.getConnectionsLenght()
//    }
//    
//    connections.others = connections.total - connections.duke - connections.yale;
//    
//    var connectionsData = [
//    {
//        value: connections.duke,
//        color:"#F7464A",
//        highlight: "#FF5A5E",
//        label: "Duke"
//    },
//    {
//        value: connections.yale,
//        color: "#46BFBD",
//        highlight: "#5AD3D1",
//        label: "Yale"
//    },
//    {
//        value: connections.others,
//        color: "#FDB45C",
//        highlight: "#FFC870",
//        label: "Others"
//    }
//    ];
//    
//    var ctx = document.getElementById("adminConnections").getContext("2d");
//    var myNewChart = new Chart(ctx).Pie(connectionsData, options);
//    
//    // NUMBER OF TRANSACTIONS BY USER UNIVERSITY
//    
//    var transactions = {
//        duke: this.data.getTotalTransactionsByUniversity(1),
//        yale: this.data.getTotalTransactionsByUniversity(2),
//        total: this.data.getTransactionsLenght()
//    }
//    
//    transactions.others = transactions.total - transactions.duke - transactions.yale;
//    
//    var transactionsData = [
//    {
//        value: transactions.duke,
//        color:"#F7464A",
//        highlight: "#FF5A5E",
//        label: "Duke"
//    },
//    {
//        value: transactions.yale,
//        color: "#46BFBD",
//        highlight: "#5AD3D1",
//        label: "Yale"
//    },
//    {
//        value: transactions.others,
//        color: "#FDB45C",
//        highlight: "#FFC870",
//        label: "Others"
//    }
//    ];
//    
//    var ctx = document.getElementById("adminTransactions").getContext("2d");
//    var myNewChart = new Chart(ctx).Pie(transactionsData, options);
//    
//};