var xmlhttp = new XMLHttpRequest();

xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var myObj = JSON.parse(this.responseText);
        
        var totalEarthquakes = parseInt(myObj.metadata.count);
        //Prints total number of Earthquakes read from USGS.gov site.
        document.getElementById("summary").innerHTML = "Total number of Earthquakes: " + myObj.metadata.count;
        
        //assembles table containing data pertaining to each earhquake
        //assembles table heading
        var myTable="<table class='table table-striped' style='width:800px'>";
        
        myTable = myTable + "<thead><tr><th>Location</th><th>Magnitude</th><th>Longitude</th><th>Latitude</th><th>Depth</th></tr></thead>";


        //assembles table rows
        myTable = myTable + "<tbody>";
        for( var i = 0; i < totalEarthquakes; i++ ){
            //adds place and magnitude to table row
            myTable = myTable + "<tr><td>" + myObj.features[i].properties.place + "</td><td>" + myObj.features[i].properties.mag + "</td>";

            //adds latitude and madnitude to table row
            myTable = myTable + "<td>" + myObj.features[i].geometry.coordinates[0] + "</td><td>" + myObj.features[i].geometry.coordinates[1] + "</td>";

            //adds latitude and madnitude to table row
            myTable = myTable + "<td>" + myObj.features[i].geometry.coordinates[2] + " Km " + "</td><tr>";

        }
        
        myTable = myTable + "</tbody></table>";

        //displays the assembled table
        document.getElementById('tablePrint').innerHTML = myTable;
    }
};

xmlhttp.open("GET", "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson", true);
xmlhttp.send();
