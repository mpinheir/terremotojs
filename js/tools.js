function sortBy(criteria, data, order){

  if(isNaN(criteria)){
    if(order == criteria){
      data.reverse();
    } else {
      data.sort(function(a, b){
         return b.properties[criteria] - a.properties[criteria];
       });
    }
  } else{
    if(order == criteria){
      data.reverse();
    } else{
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
      table += '<td style="color:' + data[i].properties.alert + '; font-weight: bold">' + data[i].properties.mag + '</td>';

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