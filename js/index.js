var xmlhttp = new XMLHttpRequest();

xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var myObj = JSON.parse(this.responseText);
        
        var totalEarthquakes = parseInt(myObj.metadata.count);
        //Prints total number of Earthquakes read from USGS.gov site.
        document.querySelector(".summary span").innerHTML = myObj.metadata.count;
        
        //assembles table containing data pertaining to each earhquake
        //assembles table heading
        var myTable="<table class='table table-striped'>";
        
        myTable = myTable + "<thead><tr><th>Location</th><th>Date</th><th>Magnitude</th><th>Longitude</th><th>Latitude</th><th>Depth</th></tr></thead>";


        //assembles table rows
        myTable = myTable + "<tbody>";
        for( var i = 0; i < totalEarthquakes; i++ ){
            //adds place  to table row
            myTable = myTable + "<tr><td>" + myObj.features[i].properties.place + "</td>";

            //adds date to table row
            let date = new Date(myObj.features[i].properties.time);
            myTable = myTable + "<td>" + date.toDateString() + "</td>";

            //adds magnitude table row
            myTable = myTable + "</td><td>" + myObj.features[i].properties.mag + "</td>";

            //adds longitude and latitude to table row
            myTable = myTable + "<td>" + myObj.features[i].geometry.coordinates[0] + "</td><td>" + myObj.features[i].geometry.coordinates[1] + "</td>";

            //adds depth to table row
            myTable = myTable + "<td>" + myObj.features[i].geometry.coordinates[2] + " Km " + "</td></tr>";

        }
        
        myTable = myTable + "</tbody></table>";

        //displays the assembled table
        document.getElementById('tablePrint').innerHTML = myTable;
    }
};

xmlhttp.open("GET", "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson", true);
xmlhttp.send();
