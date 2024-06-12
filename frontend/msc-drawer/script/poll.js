var info;

function escapeDiagramString(s) {
  s = s.replace("-", "|");
  s = s.replace(":", "^");
  return s;
}

var entryCounter = 0;

// Poll mongodb data
function poll(){
  console.log("polling...");
  sessionId = document.getElementById("sessionId").value;
  try {
    $.ajax({
      type: "get",
      url: "/api/message/" + sessionId,
      success:function(data)
      {
        // Create the MSC
        if(data.length != entryCounter){
          container = document.getElementById("diagram").innerHTML = "";
          chart = "";
          info = [];
          //paramIndex = 0;
          entryCounter = data.length;
          console.log("Entry changed");
          for(i = 0; i < data.length; i++){
            var MAX_LABEL_LEN = 60;
            var str_len = data[i].label.length;
            var label = data[i].label;
            if (str_len > MAX_LABEL_LEN) {
              var left = label.substring(0,MAX_LABEL_LEN/2);
              var right = label.substring(str_len - MAX_LABEL_LEN/2, str_len);
              label = left + "..." + right;
            }

            chart += escapeDiagramString(data[i].from) + "->" + escapeDiagramString(data[i].to) + ":" + escapeDiagramString(label);
            if(data[i].params.length > 0) {
              paramsList = "";
              // jsonParams = JSON.parse(data[i].params)
              // for(key in jsonParams)
              //   if(key.indexOf("Cookie") == -1)
              //     paramsList += "," + key.substring(0, key.indexOf("(") -1);
              for(j = 0; j < data[i].params.length; j++)
                if(data[i].params[j].type != "Cookie")
                  paramsList += "," + data[i].params[j].name;
              if(paramsList)
                paramsList = escapeDiagramString("?" + paramsList.substr(1, 30));
              // chart += paramsList + "{" + paramIndex + "}";
              chart += paramsList;
            }
            chart += "{" + i + "}";
            cleanedData = data[i];
            //delete cleanedData['_id'];
            //delete cleanedData['sessionId'];
            info[i] = cleanedData;
              //paramIndex++;

            chart += "\n";
          }
          // console.log(info);
          var d = Diagram.parse(chart);
          var options = {theme: 'simple'};
          d.drawSVG('diagram', options);
          window.scrollTo(0,document.body.scrollHeight);
        }
        // Send another request in 1 seconds.
        setTimeout(function(){
            poll();
        }, 1000);
      }
    });
  } catch (e) {
    console.log(e);
  }
}

function clean(){
  sessionId = document.getElementById("sessionId").value;
  $.ajax({
    type: "delete",
    url: "/api/message/" + sessionId,
    success:function(data)
    {
      console.log("Cleaned database");
      closeStaticPopup();
      //document.getElementById("diagram").innerHTML = "";
    }
  });
}
