function sortBy(criteria, data, order){

  if(order == criteria){
    data.reverse();
  } else {
    
    if(isNaN(criteria)){
      if (criteria == "place"){
        //special rule for strings
        data.sort(function(a, b){
          return treatString(a, b, criteria);
        });
      } else {
        //sort by properties
        data.sort(function(a, b){
           return b.properties[criteria] - a.properties[criteria];
        });
      }
    } else {
      //sort by geometry
        data.sort(function(a, b){
          return b.geometry.coordinates[criteria] - a.geometry.coordinates[criteria];
        }); 
      }
  }
  return data
}

function assembleTable(data){
  
  //assembles table rows
  let table = '<tr>';
  for( var i = 0; i < data.length; i++ ){
      //adds place  to table row
      table += '<td>' + data[i].properties.place + '</td>';
      //adds date to table row
      let date = new Date(data[i].properties.time);
      table += '<td>' + date.toDateString() + '</td>';

      //adds magnitude table row
      table += '<td>' + '<span style="color:' + data[i].properties.alert + '">&#9654 </span>' + data[i].properties.mag.toFixed(2) + '</td>';

      //adds longitude and latitude to table row
      table += '<td>' + data[i].geometry.coordinates[0] + '</td><td>' + data[i].geometry.coordinates[1] + '</td>';

      //adds depth to table row
      table += '<td>' + data[i].geometry.coordinates[2] + ' Km' + '</td></tr>';

  }
  return table;
}

function updateTable(criteria, data, order){
  data = sortBy(criteria.getAttribute('value'), data, order);
  document.querySelector('.table tbody').innerHTML = '';
  document.querySelector('.table tbody').innerHTML = assembleTable(data);
}

function treatString(a, b, criteria){
  let nameA = a.properties[criteria].toUpperCase();
  let nameB = b.properties[criteria].toUpperCase();
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }
  return 0; 
}