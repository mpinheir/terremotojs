var xmlhttp = new XMLHttpRequest();

xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var myObj = JSON.parse(this.responseText);

        var earthquakesInfo = myObj.features;
        
        var totalEarthquakes = parseInt(myObj.metadata.count);
        //Prints total number of Earthquakes read from USGS.gov site.
        document.querySelector('.summary span').innerHTML = myObj.metadata.count;
        //assembles table containing data pertaining to each earhquake
        //assembles table heading
        var myTable = '<table class="table table-striped">';

        //assembles table containing data pertaining to each earhquake
        //assembles table heading
        myTable += '<thead><th value="place">Location</th><th value="time">Date</th><th value="mag">Magnitude</th><th value="0">Longitude</th><th value="1">Latitude</th><th value="2">Depth</th></thead><tbody>';
     
        myTable += assembleTable(earthquakesInfo) + '</tbody></table>';
        //displays the assembled table
        document.getElementById('tablePrint').innerHTML = myTable;

        //select the criteria for sorting
        var tableHeads = document.querySelectorAll('.table th');

        var order = "time";
        //add the click event to the table heads
        tableHeads.forEach(function(head){
            head.onclick = function(){
                updateTable(head, earthquakesInfo, order);
                order = head.getAttribute('value');
            }
        });
    }
};

xmlhttp.open('GET', 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson', true);
xmlhttp.send();
