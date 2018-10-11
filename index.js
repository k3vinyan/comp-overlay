$( document ).ready(function(){
  let data = {};
  let cluster;

  const dataLi = document.createElement('li');
  dataLi.innerHTML = "<a href='#' class='tabNoArrow'>Collect Data</a>";
  dataLi.id = 'getDataLi';
  dataLi.style = 'z-index: 1000;';
  dataLi.classList.add('hide-button', 'level1', 'inactive')

  // const resetButton = document.createElement('button');
  // resetButton.innerText = 'reset';
  // resetButton.classList.add("resetButton");

  const createTableLi = document.createElement('li');
  createTableLi.innerHTML = "<a href='#' class='tabNoArrow'>Create Table</a><div class='rightCapNoArrow'></div>";
  createTableLi.id = 'createTableLi';
  dataLi.style = 'z-index; 999;';
  createTableLi.classList.add('hide-button', 'level1', 'inactive', 'last');

  $('#topNav').append(dataLi);
  $('#topNav').append(createTableLi);
  //$('.greeter').after(resetButton);


  $('.resetButton').click(function(){
    data = resetData(data);
  });

  $('#createTableLi').click(function(){
    createTracker(data);
    createTable(data, createTableCB);

    $('.route-tr').click(function(){
      console.log('cat')
      updateCheckbox(this);
    })
    $('#topNavContainer').hide();
    $('#content').hide();
    $('#subnav_container').hide();
    $('#ShipmentSearchTable').hide();
    $('.hide-button').hide();
    $('#searchbar').keyup(filter);
  });

  function updateCheckbox(that){
    console.log(that)
    console.log($(that)[0].children[5].children[0])
    let bool = !($(that)[0].children[5].children[0].checked);
    $(that)[0].children[5].children[0].checked = bool;
    if(bool){
      let count = parseInt($('#routeCount')[0].innerText) - 1;
      $('#routeCount')[0].innerText = count;
    } else {
      let count = parseInt($('#routeCount')[0].innerText) + 1;
      $('#routeCount')[0].innerText = count;
    }
  }


  $('#getDataLi').click(function(){
    const even = $('.even');
    const odd = $('.odd');
    let searchRoute = prompt("Route?", "V");
    cluster = searchRoute;

    for(let i = 0; i < even.length; i++){

      let tba = even[i].children[2].innerText
      let route = even[i].children[16].innerHTML
      let status = even[i].children[18].innerHTML
      let associate = even[i].children[19].innerHTML
      let routeSeq = even[i].children[24].innerHTML
      let routeSortCode = even[i].children[25].innerHTML
      let regex = new RegExp("^" + searchRoute + "\\d+");

      if(regex.test(route)){
        let item = {
          type: '',
          total: 0,
          atStation: 0,
          betweenStation: 0,
          others: 0,
          tbas: []
        }

        if(data[route] === undefined){
          if(associate === "OMW-USER/FLEX" || associate === "" || associate === "&nbsp;"){
            item['type'] = "FLEX";
          } else {
            item['type'] = "DA";
          }
          item["total"] += 1;

          if(status === "At Station"){
            item['atStation'] += 1;
          } else if(status === "Between FC and Stations" || status === "Between Stations"){
            item['betweenStation'] += 1;
          } else {
            item['others'] += 1;
          }

          item["tbas"].push(
            {
              tba: tba,
              status: status,
              routeSeq: routeSeq,
              routeSortCode: routeSortCode
            }
          )

          data[route] = item;
        } else {
          data[route]["total"] += 1;

          if(status === "At Station"){
            data[route]['atStation'] += 1;
          } else if(status === "Between FC and Stations" || status === "Between Stations"){
            data[route]['betweenStation'] += 1;
          } else {
            data[route]['others'] += 1;
          }

          data[route]["tbas"].push(
            {
              tba: tba,
              status: status,
              routeSeq: routeSeq,
              routeSortCode: routeSortCode
            }
          )
        }
      }
    }

    for(let i = 0; i < odd.length; i++){
      let tba = odd[i].children[2].innerText
      let route = odd[i].children[16].innerHTML
      let status = odd[i].children[18].innerHTML
      let associate = odd[i].children[19].innerHTML
      let routeSeq = odd[i].children[24].innerHTML
      let routeSortCode = odd[i].children[25].innerHTML

      let regex = new RegExp("^" + searchRoute + "\\d+");

      if(regex.test(route)){
        let item = {
          flexRoute: false,
          total: 0,
          atStation: 0,
          betweenStation: 0,
          others: 0,
          tbas: []
        }

        if(data[route] === undefined){
          if(associate === "OMW-USER/FLEX" || associate === "" || associate === "&nbsp;"){
            item['type'] = "FLEX";
          } else {
            item['type'] = "DA";
          }
          item["total"] += 1;

          if(status === "At Station"){
            item['atStation'] += 1;
          } else if(status === "Between FC and Stations" || status === "Between Stations"){
            item['betweenStation'] += 1;
          } else {
            item['others'] += 1;
          }

          item["tbas"].push(
            {
              tba: tba,
              status: status,
              routeSeq: routeSeq,
              routeSortCode: routeSortCode
            }
          )

          data[route] = item;
        } else {

          data[route]["total"] += 1;

          if(status === "At Station"){
            data[route]['atStation'] += 1;
          } else if(status === "Between FC and Stations" || status === "Between Stations"){
            data[route]['betweenStation'] += 1;
          } else {
            data[route]['others'] += 1;
          }

          data[route]["tbas"].push(
            {
              tba: tba,
              status: status,
              routeSeq: routeSeq,
              routeSortCode: routeSortCode
            }
          )
        }
      }
    }

    console.log(data);

  })

  function resetData(data){
    data = {};
    return data;
  }

  function createTableCB(table){
    $('.greeter').after(table);
  }



  function createTable(data, callback){
    let keys = [];

    let input2 =  "<div class='input-group mb-3'>" +
                    "<div class='input-group-prepend'>" +
                      "<span class='input-group-text' id='basic-addon1'>Search</span>" +
                    "</div>" +
                    "<input type='text' id='searchbar' class='form-control' placeholder='Search Route Here....' >" +
                  "</div>"

    let table = input2 +
      "<table class='table table-hover' id='routeTable'>" +
        "<thead>" +
          "<tr>" +
            "<th>Route</th>" +
            "<th class='text-center'>Type</th>" +
            "<th class='text-center'>Between Stations</th>" +
            "<th class='text-center'>At Station</th>" +
            "<th class='text-center'>Total</th>" +
            "<th class='text-center'>Check Out</th>" +
          "</tr>" +
        "</thead>" +
        "<tbody>"

    for(let key in data){
      if(data.hasOwnProperty(key)){
        keys.push(key)
      }
    }
    let keyArr = [];

    for(let i = 0; i < keys.length; i++){
      let value = keys[i].replace(cluster, '');
      keyArr[value] = keys[i]
    }

    for(i in keyArr){
      let route = keyArr[i];
      if(route != undefined){
        if(data[route]['type'] === 'FLEX'){
          table +=
            "<tr class='route-tr'>" +
              "<td>" + route + "</td>" +
              "<td class='text-center'>" + data[route]['type'] + "</td>" +
              "<td class='text-center'>" + data[route]['betweenStation'] + "</td>" +
              "<td class='text-center'>" + data[route]['atStation'] + "</td>" +
              "<td class='text-center'>" + data[route]['total'] + "</td>" +
              "<td class='text-center'><input type='checkbox' class='checkbox' value=" + route + "></td>" +
            "<tr>"
        } else {
          table +=
            "<tr class='table-dark'>" +
              "<td>" + route + "</td>" +
              "<td class='text-center'>" + data[route]['type'] + "</td>" +
              "<td class='text-center'>" + data[route]['betweenStation'] + "</td>" +
              "<td class='text-center'>" + data[route]['atStation'] + "</td>" +
              "<td class='text-center'>" + data[route]['total'] + "</td>" +
              "<td class='text-center'><input type='checkbox' class='checkbox' value=" + route + " checked></td>" +
            "<tr>"
        }



      }
    }

    table += "</tbody></table>";

    callback(table);
  }

  function createTracker(data){
    let count = "<span id='routeCount'>" + Object.keys(data).length + "</span>"
    const str = "<h1>ROUTES LEFT ON SITE: " + count + "</h1>";
    $('.greeter-user-info')[0].children[0].innerHTML = str;
  }

})

function filter(){
  let input, filter, table, tr, td, i;
  input = document.getElementById('searchbar');
  filter = input.value.toUpperCase();
  table = document.getElementById("routeTable");
  tr = table.getElementsByTagName("tr");

  for(let i = 0; i < tr.length; i++){
    td = tr[i].getElementsByTagName("td")[0];
    if(td){
      if(td.innerHTML.toUpperCase().indexOf(filter) > - 1){
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

//text-decoration: line-through;
