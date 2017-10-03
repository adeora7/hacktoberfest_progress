// Query  //

function getData(handle){

  var reqUrl = "https://api.github.com/search/issues?q=author%3A"+handle+"+type%3Apr"+
              "+created%3A2017-09-30T00:00:00-12:00..2017-10-31T23:59:59-12:00+is%3Apublic";

  var req = new XMLHttpRequest();
  req.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
      var data = JSON.parse(req.responseText);
      document.getElementById("prCompleteCount").innerHTML = (data['total_count']>4?"4":data['total_count'])+ "/4";
      var message = "";
      switch(data['total_count']){
        case 0:
          message = "It is never too late to start.";
          break;
        case 1:
          message = "Still long way to go.";
          break;
        case 2:
          message = "Awesome, you are half way through.";
          break;
        case 3:
          message = "Just one more to go.";
          break;
        default:
          message = "Congratulations, you have completed hacktoberfest 2017.";

      }
      document.getElementById("message").innerHTML = message;
    }
  };
  req.open("GET", reqUrl, true);
  // req.setRequestHeader('Cache-Control','max-age=0');
  req.send();

}
