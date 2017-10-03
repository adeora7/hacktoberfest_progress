var inputHandle = document.getElementById("githubHandle");
var btn = document.getElementById("check");

inputHandle.onkeydown = function(event){
	if(event.keyCode == 13)
	{
		btn.click();
	}
}
btn.onclick = function()
{
	console.log("hello world");
    var handle = document.getElementById("githubHandle").value;
	console.log(handle);
	var result = document.getElementById("result");
	if(handle != "" && handle != null)
	{
		result.innerHTML = "Loading...";
		getData(handle);
	}
	else
	{
		result.innerHTML = "Please enter a valid Github Username";
	}
}

function getData(handle){

  var reqUrl = "https://api.github.com/search/issues?q=author%3A"+handle+"+type%3Apr"+
              "+created%3A2017-09-30T00:00:00-12:00..2017-10-31T23:59:59-12:00+is%3Apublic";

  var req = new XMLHttpRequest();
  req.onreadystatechange = function(){
  	var res = "";
    if(this.readyState == 4 && this.status == 200){
      var data = JSON.parse(req.responseText);
      // document.getElementById("resultHandle").innerHTML = handle;
      res +="<div id='resultHandle'>"+handle+"</div>";
      var count = (data['total_count']>4?"4":data['total_count'])+ "/4";
      res +="<div id='prCompleteCount'>"+count+"</div>";
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
      res +="<div id='message'>"+message+"</div>";
      document.getElementById("result").innerHTML = res;
    }
  };
  req.open("GET", reqUrl, true);
  // req.setRequestHeader('Cache-Control','max-age=0');
  req.send();

}
