const tools = (function() {

    const 
        _clearTable = () => document.querySelector('.table tbody').innerHTML = '',

        _fillTable = data => document.querySelector('.table tbody').innerHTML = data,

        _getTime = time => new Date(time).toDateString(),

        _treatString = (a, b, criteria) => {
            const nameA = a.properties[criteria].toUpperCase(),
                  nameB = b.properties[criteria].toUpperCase();

            if (nameA < nameB) return -1; 
            if (nameA > nameB) return 1;
            return 0; 
        }
        
        _sortBy = (criteria, data, order) => {

            if (order === criteria) {
                data.reverse();
            }
            else if (isNaN(criteria)) {

                if (criteria == 'place') {
                    //special rule for strings
                    data.sort((a, b) => _treatString(a, b, criteria));
                }
                else {
                    // sort by properties
                    data.sort((a, b) => b.properties[criteria] - a.properties[criteria]);
                }
            }
            else {
                //sort by geometry
                data.sort(function(a, b){
                    return b.geometry.coordinates[criteria] - a.geometry.coordinates[criteria];
                }); 
            }

            return data;
        };


    return {
        updateTable : function(criteria, data, order) {
            data = _sortBy(criteria.getAttribute('value'), data, order);
            _clearTable();
            _fillTable(this.assembleTable(data));

        },
        assembleTable : function(data) {

            //assembles table rows
            let table = '';
            
            data.forEach(element => {
                table += `
                    <tr>
                        <td>${element.properties.place}</td>
                        <td>${_getTime(element.properties.time)}</td>
                        <td><span style='color:${element.properties.alert}'>&#9654</span></td>
                        <td>${element.geometry.coordinates[0]}</td>
                        <td>${element.geometry.coordinates[1]}</td>
                        <td>${element.geometry.coordinates[2]} Km</td>
                    </tr>
                `
            });

            return table;
        }
    };

})();

const UIController = (function() {

    const _DOMString = {
        summary : '.summary span.amount',
        table : 'tablePrint',
        tableHead : '.table th'
    }

    // Jquery Animation
    const _countTotalAnimation = () => {
        $(_DOMString.summary).each(function () {
            $(this).prop('Counter',0).animate({
                Counter: $(this).text()
            }, {
                duration: 4000,
                easing: 'swing',
                step: function (now) {
                    $(this).text(Math.ceil(now));
                }
            });
        });

    }

    return {
        DOM : _DOMString,

        totalEarthquakes : amount => {
            document.querySelector(_DOMString.summary)
            .textContent = amount;
            _countTotalAnimation()
        },

        PrintTable : table => {
            document.getElementById(_DOMString.table)
            .innerHTML = table;
        }
    }

})();

//Main Function
(function(UICtrl, utils) {

    // The stage of this var will change when the event 'onclick' is triggered by a user
    let order = 'time'

    fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson')
        .then(data => data.json())
        .then(obj => {
            return {
                earthQuakesInfo : obj.features,
                totalEarthQuakes : obj.metadata.count
            };
        })
        .then(obj => {
            //Prints total number of Earthquakes read from USGS.gov site.
            UICtrl.totalEarthquakes(obj.totalEarthQuakes);
            
            //assembles table containing data pertaining to each earhquake
            //assembles table heading
            const table = `
            <table class="table table-striped">
                <thead>
                    <th value="place">Location</th>
                    <th value="time">Date</th>
                    <th value="mag">Magnitude</th>
                    <th value="0">Longitude</th>
                    <th value="1">Latitude</th>
                    <th value="2">Depth</th>
                </thead>
                <tbody>
                    ${utils.assembleTable(obj.earthQuakesInfo)}
                </tbody>
            </table>
            `
            //displays the assembled table
            UICtrl.PrintTable(table);

            //get criteria for sorting
            const tableHeads = document.querySelectorAll(UICtrl.DOM.tableHead);

            // delete totalEarthQuakes from obj
            delete obj.totalEarthQuakes;

            //Add criteria into obj then return it
            obj.tableHeads = tableHeads;

            return  obj;

        })
        .then(obj => {
            //add the click event to the table heads
            obj.tableHeads.forEach(head => {
                head.onclick = _ => {
                    utils.updateTable(head, obj.earthQuakesInfo, order);
                    order = head.getAttribute('value');
                }
            })            
        })
        .catch(error => {
            alert('Something went wong, please check the console.')
            console.log(error);
        })



})(UIController, tools);
