
function exportMSC(){
  sessionId = document.getElementById("sessionId").value;
  $.ajax({
    type: "get",
    url: "/api/export/" + sessionId,
    success:function(data)
    {
      var a = document.createElement("a");
      console.log(data);
      var file = new Blob([JSON.stringify(data, null, 2)], {type: "application/json"});
      a.href = URL.createObjectURL(file);
      a.download = "msc.json";
      a.click();
    }
  });
}

function importMSC(file){
  var fileReader = new FileReader();
  fileReader.onload = function(fileLoadedEvent){
    jsonData = JSON.parse(fileLoadedEvent.target.result);
    console.log(jsonData);
    for(i = 0; i < jsonData.length; i++){
      $.ajax({
        type: "post",
        url: "/api/message",
        data: jsonData[i],
        success:function(result)
        {
          console.log(result);
        }
      });
    }
  };

  fileReader.readAsText(file, "UTF-8");

}

function showImportWindow(){
  document.getElementById("hiddenImportMSC").click();
}

function changeMSCSelection(oldMessage, newMessage) {
  if(oldMessage != -1){
    document.getElementById("arrow" + oldMessage).style.fill = "#000000";
    document.getElementById("arrow" + oldMessage).style.fontWeight = "normal";
  }
  selectedMessage = newMessage;
  if(newMessage != -1){
    document.getElementById("arrow" + newMessage).style.fill = "#0056b3";
    document.getElementById("arrow" + newMessage).style.fontWeight = "bold";
  }
}

function openMessageDetails(messageIndex) {
  window.open("/app/message/" + info[messageIndex]._id, "_blank");
}

// variable to keep track of the message that has the details displayed in the popup
var selectedMessage = -1;
function fillStaticPopup(messageIndex) {
  changeMSCSelection(selectedMessage, messageIndex);

  title = "<h4>" + info[messageIndex].label + "</h4>";
  paramsList = "<table>"+
  "<tr><th></th><th>Type</th><th>Name</th><th>Value</th>";
  for (i = 0; i < info[messageIndex].params.length; i++) {
    paramsList += fillTableRow(messageIndex, i, info[messageIndex].params[i].type, info[messageIndex].params[i].name, prepareValueForTable(info[messageIndex].params[i].value), true);
  }
  paramsList += "</table>";
  document.getElementById("messageDetailsLink").href= "/app/message/" + info[messageIndex]._id;
  document.getElementById("copyJson").setAttribute("onclick", "copyJsonToClipboard(" + messageIndex + ")");
  document.getElementById("messageInfoContent").innerHTML = title + paramsList;
  document.getElementById("messageInfo").style.display = "inherit";
  $(document).ready(function(){
      $('[data-toggle="tooltip-json"]').tooltip();
      $('[data-toggle="tooltip-params"]').tooltip();
  });
}

function escapeHtmlChars(value) {
  value = value.replace(/&/g, '&amp;');
  value = value.replace(/</g, '&lt;');
  value = value.replace(/>/g, '&gt;');
  value = value.replace(/"/g, '&quot;');
  value = value.replace(/'/g, '&apos;');
  return value;
}

function prepareValueForTable(value) {
  value = escapeHtmlChars(value);
  if(value.length > 100)
    value = value.substring(0, 100) + "...";
  return value;
}

function fillTableRow(messageIndex, paramIndex, type, name, value, enableCopy) {
  row = "<tr>";
  if(enableCopy)
    row += "<td class=\"params-table\"><a data-toggle=\"tooltip-params\" data-placement=\"left\" title=\"Copy param to clipboard\">" +
    "<span onclick=\"copyParamToClipboard(" + messageIndex + ", '" + paramIndex + "')\" class=\"iconify\" data-icon=\"ant-design:copy-outline\" data-inline=\"false\"></span></a></td>";

  row += "<td class='paramInfoTableType'>" + decodeURIComponent(type) + "</td>" +
  "<td class='paramInfoTableName'>" + decodeURIComponent(name) + "</td>" +
  "<td class='paramInfoTableValue'>" + value + "</td>" +
  "</tr>";
  return row;
}

function closeStaticPopup(){
  document.getElementById("messageInfo").style.display = "none";
  changeMSCSelection(selectedMessage, -1);
}


function showHover(messageIndex) {
  if(info[messageIndex].params.length > 0) {
    paramsList = "<table>" +
    "<tr><th>Type</th><th>Name</th><th>Value</th>";
    for (i = 0; i < Math.min(info[messageIndex].params.length, 15); i++) {
      paramsList += fillTableRow(messageIndex, i, info[messageIndex].params[i].type, info[messageIndex].params[i].name, prepareValueForTable(info[messageIndex].params[i].value), false);
    }
    if(info[messageIndex].params.length >= 15)
      paramsList += fillTableRow(messageIndex, -1, "...", "...", "...", false);
    paramsList += "</table>";
  } else {
    paramsList = 'This message does not have any parameter'
  }
  $('p#popup-param-content').html(paramsList);


  if(info[messageIndex].body.length > 0) {
    messageBody = escapeHtmlChars(decodeURIComponent(info[messageIndex].body.substring(0, Math.min(info[messageIndex].body.length, 1200))));
    if(info[messageIndex].body.length > 1200)
      messageBody += "...";
  } else {
    messageBody = "The body of this message is empty";
  }
  $('div#popup-body-content').html(messageBody);
  $('div#popup').show();

}


function hideHover(){
  $('div#popup').hide();
}

function moveHoverPopup(event) {
  var moveLeft = 30;
  var moveDown = 10;
  if(event.pageY + moveDown + $("div#popup").height() > $(window).height())
    $("div#popup").css('top', event.pageY + moveDown - $("div#popup").height()).css('left', event.pageX + moveLeft);
  else
    $("div#popup").css('top', event.pageY + moveDown).css('left', event.pageX + moveLeft);
}


function textToClipboard(value) {
  tmpElement = document.createElement('textarea');
  tmpElement.value = value;
  // Set non-editable to avoid focus and move outside of view
  tmpElement.setAttribute('readonly', '');
  tmpElement.style = {position: 'absolute', left: '-9999px'};
  document.body.appendChild(tmpElement);
  // Select text inside element
  tmpElement.select();
  // Copy text to clipboard
  document.execCommand('copy');
  // Remove temporary element
  document.body.removeChild(tmpElement);
}

function copyParamToClipboard(messageIndex, paramIndex) {
  textToClipboard(info[messageIndex].params[paramIndex].value);
  showToastAlert("Parameter <i>" + info[messageIndex].params[paramIndex].name + "</i> copied");
}

function copyJsonToClipboard(messageIndex) {
  showToastAlert("JSON copied");
  textToClipboard(JSON.stringify(info[messageIndex]));

}

function showToastAlert(text){
  $('.alert-toast').html(text);
  $('.alert-toast').stop().fadeIn(200).delay(1000).fadeOut(200);
}


function search(){
  document.getElementById("search-results").innerHTML = "";
  valueToSearch = document.getElementById("searchBox").value.toLowerCase();
  if(valueToSearch != ""){
    matchCount = 0;
    matchContent = '<div class="list-group scrollable-content">';
    searchInUrl = document.getElementById("cbxURL").checked;
    searchInHeaders = document.getElementById("cbxHeaders").checked;
    searchInParams = document.getElementById("cbxParams").checked;
    for(i = 0; i < info.length; i++){
      matchFound = false;
      if(searchInUrl) {
        if((info[i].from == "User Agent"?info[i].to:info[i].from).toLowerCase().includes(valueToSearch) || info[i].label.toLowerCase().includes(valueToSearch)){
          matchCount++;
          matchContent += '<a href="/app/message/' + info[i]._id + '" class="list-group-item list-group-item-action" target="blank">' + info[i].label + '</a>';
          matchFound = true;
        }
      }
      if(!matchFound && searchInHeaders) {
        for(j = 0; j < info[i].headers.length; j++){
          if(info[i].headers[j].name.toLowerCase().includes(valueToSearch) || info[i].headers[j].value.toLowerCase().includes(valueToSearch)){
            matchCount++;
            matchContent += '<a href="/app/message/' + info[i]._id + '" class="list-group-item list-group-item-action" target="blank">' + info[i].label + '</a>';
            matchFound = true;
          }
        }
      }
      if(!matchFound && searchInParams) {
        for(j = 0; j < info[i].params.length; j++){
          if(info[i].params[j].name.toLowerCase().includes(valueToSearch) || info[i].params[j].value.toLowerCase().includes(valueToSearch)){
            matchCount++;
            matchContent += '<a href="/app/message/' + info[i]._id + '" class="list-group-item list-group-item-action" target="blank">' + info[i].label + '</a>';
            matchFound = true;
          }
        }
      }
    }

    if(matchCount == 0)
      showToastAlert("No match found");
    else{
      showToastAlert(matchCount + " occurence of " + valueToSearch + " found");
      matchContent +='</div>' +
      '<button id="closeSearchButton" onclick="hideSearchResult()" class="btn btn-light">Close</button>';
      document.getElementById("search-results").innerHTML = matchContent;
    }
  } else {
    showToastAlert("Please insert a valid value in the search field");
  }
}

function hideSearchResult(){
  document.getElementById("search-results").innerHTML = "";
  document.getElementById("searchBox").value = "";
  closeStaticPopup();
}



function showStixHostPopup(){
  sessionId = document.getElementById("sessionId").value;
  $.ajax({
    type: "get",
    url: "/api/host/" + sessionId,
    success:function(data)
    {
      hostNameSelect = document.getElementById("stixHostName");
      hostNameSelect.options.length = 0;
      for(i = 0; i < data.hostList.length; i++) {
        tmpOption = document.createElement("option");
        tmpOption.value = data.hostList[i];
        tmpOption.text = data.hostList[i];
        hostNameSelect.appendChild(tmpOption);
      }
    }
  });
  document.getElementById("stixHostPopup").style.display = "inherit";
}

function closeStixHostPopup(){
  document.getElementById("stixHostPopup").style.display = "none";
}

function extractParamListFromMessages(data) {
  paramList = [];
  for(i = 0; i < data.length; i++) {
    for(j = 0; j < data[i].params.length; j++) {
      paramList.push(data[i].params[j].name)
    }
  }
  paramList = [...new Set(paramList)];
  return paramList;
}

function getAllStixData() {
  sessionId = document.getElementById("sessionId").value;
  $.ajax({
    type: "get",
    url: "/api/message/" + sessionId,
    success: function(data)
    {
      paramList = extractParamListFromMessages(data);
      visualizeStixData(JSON.stringify(paramList));
    }
  });
}

function getStixHostData() {
  sessionId = document.getElementById("sessionId").value;
  hostName = document.getElementById("stixHostName").value;
  $.ajax({
    type: "get",
    url: "/api/message/" + sessionId + "/host/" + hostName,
    success: function(data)
    {
      paramList = extractParamListFromMessages(data);
      visualizeStixData(JSON.stringify(paramList));
    }
  });
  closeStixHostPopup();
}


function showStixCustomSearchPopup(){
  document.getElementById("stixCustomSearchText").value = "";
  document.getElementById("stixCustomSearchPopup").style.display = "inherit";
}

function closeStixCustomSearchPopup(){
  document.getElementById("stixCustomSearchPopup").style.display = "none";
}

function getStixCustomData() {

  paramList = document.getElementById("stixCustomSearchText").value.split(";");
  for(i = 0; i < paramList.length; i++)
    paramList[i] = paramList[i].trim();
  paramList = paramList.filter(item => item);
  visualizeStixData(JSON.stringify(paramList));
  closeStixCustomSearchPopup();
}

function visualizeStixData(data) {
  document.getElementById("stixParamList").value = data;
  document.getElementById("frmStixSupport").submit();
}
